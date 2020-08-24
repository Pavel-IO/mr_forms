<?php

require __DIR__ . '/vendor/autoload.php';

use Nette\Database\Connection;
use Nette\Utils\Json;

class MrForms {
    private Connection $db;

    public function __construct(Connection $db) {
        $this->db = $db;
    }

    public function insertForm(array $values): void {
        $this->db->query('INSERT INTO forms ?', $values + ['inserted' => new \Datetime]);
    }

    public function highestIdInt(): string {
        return $this->db->fetchField('SELECT MAX(CAST(assignedId AS UNSIGNED)) FROM forms');
    }

    public function hasId(string $id): bool {
        return $this->db->fetchField('SELECT COUNT(*) FROM forms WHERE AssignedID = ?', $id) > 0;
    }
}

class Response {
    private bool $status;
    private ?string $assignedId = null;
    private string $message = '';

    public function statusOk(string $id): void {
        $this->status = 1;
        $this->assignedId = $id;
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

const ID_SUFFIX = 'A';
$allowed = ['VisitID', 'Jmeno', 'Prijmeni', 'RC', 'Datum_narozeni', 'Matersky_jazyk', 'Vyska', 'Vaha', 'Pohlavi', 'Stranova_dominance', 'Zrakova_korekce'];

$src = (array)Json::decode($_GET['form']);
$values = [];
foreach ($allowed as $key) {
    $values[$key] = !empty($src[$key]) ? $src[$key] : '';
}

$response = new Response;
$forms = new MrForms(new Connection('mysql:host=127.0.0.1;dbname=mr_forms', '***', '***'));
if (empty($values['VisitID'])) {
    $response->statusOk(($forms->highestIdInt() + 1).ID_SUFFIX);
} elseif (!validateId($values['VisitID'], ID_SUFFIX)) {
    $response->statusError('Zadané id '.$values['VisitID'].' je v nesprávném formátu. Použijte prosím tvar "<číslo>'.ID_SUFFIX.'".');
} else {
    if ($forms->hasId($values['VisitID'])) {
        $response->statusError('Id '.$values['VisitID'].' je již použito. Vyberte prosím jiné.');
    } else {
        $response->statusOk($values['VisitID']);
    }
}
$forms->insertForm($values + $response->getDbValues());

// '{"status":"ok", "assignedId": "1234A", "message":""}';
echo json_encode($response->getClientResponse());
