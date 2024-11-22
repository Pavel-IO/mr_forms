<?php

require __DIR__ . '/vendor/autoload.php';

use Nette\Database\Connection;
use Nette\Utils\Json;
use Nette\Neon\Neon;

$config = Neon::Decode(file_get_contents('config.neon'));

class MrForms {
    private Connection $db;

    public function __construct(Connection $db) {
        $this->db = $db;
    }

    public function insertForm(array $values): int {
        $this->db->query('INSERT INTO forms ?', $values + ['inserted' => new \Datetime]);
        return $this->db->getInsertId();
    }

    public function highestIdInt(): string {
        return $this->db->fetchField('SELECT MAX(CAST(assignedId AS UNSIGNED)) FROM forms');
    }

    public function hasId(string $id): bool {
        return $this->db->fetchField('SELECT COUNT(*) FROM forms WHERE AssignedID = ?', $id) > 0;
    }

    public function getDatesForId(string $id): array {
        return array_values($this->db->fetchPairs('SELECT id, DATE_FORMAT(inserted, "%e. %c. %Y") FROM forms WHERE AssignedID = ? ORDER BY id', $id));
    }
}

class Response {
    private bool $status;
    private ?string $assignedId = null;
    private string $message = '';

    public function statusOk(string $id, string $message = ''): void {
        $this->status = 1;
        $this->assignedId = $id;
        $this->message = $message;
    }

    public function statusError(string $message): void {
        $this->status = 0;
        $this->message = $message;
    }

    public function getDbValues(): array {
        return ['status' => $this->status, 'AssignedID' => $this->assignedId];
    }

    public function getClientResponse(): array {
        return ['status' => $this->status ? 'ok' : 'error', 'assignedId' => $this->assignedId ?? '', 'message' => $this->message];
    }
}

function validateId(string $id, string $suffix): bool {
    assert(strlen($suffix) == 1);
    return strlen($id) >=2 && substr($id, -1) == $suffix && is_numeric(substr($id, 0, -1));
}

function buildNewId(MrForms $forms, string $idSuffix): string {
    return ($forms->highestIdInt() + 1).$idSuffix;
}

$container = [
    'dbConnection' => new Connection($config['dbDsn'], $config['dbUser'], $config['dbPass'])
];

function actionSave($container, $idSuffix) {
    $allowed = ['VisitID', 'Fantom', 'Jmeno', 'Prijmeni', 'RC', 'Datum_narozeni', 'Zastupce', 'Zastupce_jmeno', 'Matersky_jazyk', 'Vyska', 'Vaha', 'Pohlavi', 'Stranova_dominance', 'Zrakova_korekce', 'Nalez'];

    $src = (array)Json::decode($_GET['form']);
    $values = [];
    foreach ($allowed as $key) {
        $values[$key] = !empty($src[$key]) ? $src[$key] : '';
    }

    $response = new Response;
    $forms = new MrForms($container['dbConnection']);
    if (empty($values['VisitID'])) {
        $response->statusOk(buildNewId($forms));
    } elseif (!validateId($values['VisitID'], $idSuffix)) {
        $response->statusError('Zadané id '.$values['VisitID'].' je v nesprávném formátu. Použijte prosím tvar "<číslo>'.$idSuffix.'".');
    } else {
        if ($forms->hasId($values['VisitID'])) {
            $response->statusOk($values['VisitID'], 'Id '.$values['VisitID'].' již bylo použito: '.implode(', ', $forms->getDatesForId($values['VisitID'])));
        } else {
            $response->statusOk($values['VisitID']);
        }
    }
    $dbId = $forms->insertForm($values + $response->getDbValues());

    // '{"status":"ok", "assignedId": "1234A", "message":"", 'dbId': 456}';
    echo json_encode($response->getClientResponse() + ['dbId' => $dbId]);
}

function actionNewId($container, string $idSuffix ) {
    $forms = new MrForms($container['dbConnection']);
    echo json_encode(['status' => 'ok', 'newId' => buildNewId($forms, $idSuffix)]);
}

if (!empty($_GET['form'])) {
    actionSave($container, $config['idSuffix']);
} elseif (!empty($_GET['getNewId'])) {
    actionNewId($container, $config['idSuffix']);
} else {
    echo 'Invalid request.';
}
