<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Honeypot anti-spam: campo invisível que só bots preenchem.
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

function campo($chave) {
    return htmlspecialchars(trim($_POST[$chave] ?? ''), ENT_QUOTES, 'UTF-8');
}

$nome     = campo('nome');
$cargo    = campo('cargo');
$empresa  = campo('empresa');
$email    = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$telefone = campo('telefone');
$setor    = campo('setor');
$servico  = campo('servico');
$mensagem = campo('mensagem');

if (!$nome || !$empresa || !$email) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'campos_obrigatorios']);
    exit;
}

$destinatario = 'contato@btabrasil.com.br';
$assunto = "Novo contato pelo site - $nome ($empresa)";

$corpo  = "Nova solicitacao de sessao de contexto pelo site btabrasil.com.br\n\n";
$corpo .= "Nome: $nome\n";
$corpo .= "Cargo: $cargo\n";
$corpo .= "Empresa: $empresa\n";
$corpo .= "E-mail: $email\n";
$corpo .= "Telefone: $telefone\n";
$corpo .= "Setor: $setor\n";
$corpo .= "Frente de interesse: $servico\n\n";
$corpo .= "Mensagem:\n$mensagem\n";

$cabecalhos  = "From: Site BTA Brasil <naoresponder@btabrasil.com.br>\r\n";
$cabecalhos .= "Reply-To: $email\r\n";
$cabecalhos .= "Content-Type: text/plain; charset=UTF-8";

$enviado = @mail($destinatario, $assunto, $corpo, $cabecalhos);

if ($enviado) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'envio_falhou']);
}
