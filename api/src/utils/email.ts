import { v4 as uuidv4 } from 'uuid';

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

export type PngInfo = {
  name: string;
  contentId: string;
  base64: string;
};

export function generateMimeEmailWithPng(
  from: string,
  to: string,
  subject: string,
  body: string,
  pngInfo: PngInfo,
): string {
  const boundary = `${uuidv4()}`;
  const lines: string[] = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(body, 'utf-8').toString('base64'),
    '',
    `--${boundary}`,
    `Content-Type: image/png; name="${pngInfo.name}.png"`,
    'Content-Transfer-Encoding: base64',
    `Content-ID: <${pngInfo.contentId}>`,
    '',
    pngInfo.base64,
    '',
    `--${boundary}--`,
  ];
  return lines.join('\n');
}
