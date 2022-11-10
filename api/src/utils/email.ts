export function generateMimeEmail(
  from: string,
  to: string,
  subject: string,
  body: string,
): string {
  const lines: string[] = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(body, 'utf-8').toString('base64'),
  ];
  return lines.join('\n');
}
