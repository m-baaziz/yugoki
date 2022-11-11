/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import {
  APP_DOMAIN,
  EmailContent,
  generateMimeEmail,
  generateMimeEmailWithPng,
  PngInfo,
} from '../utils/email';

const NO_REPLY_EMAIL = `no-reply@${APP_DOMAIN}`;

export default class EmailAPI extends DataSource {
  sesClient: SESv2Client;
  textEncoder: TextEncoder;
  context: any;

  constructor(sesClient: SESv2Client) {
    super();
    this.sesClient = sesClient;
    this.textEncoder = new TextEncoder();
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async sendEmail(
    to: string,
    content: EmailContent,
  ): Promise<string | undefined> {
    try {
      const response = await this.sesClient.send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: [to],
          },
          FromEmailAddress: NO_REPLY_EMAIL,
          Content: {
            Raw: {
              Data: this.textEncoder.encode(
                generateMimeEmail(NO_REPLY_EMAIL, to, content),
              ),
            },
          },
        }),
      );
      return Promise.resolve(response.MessageId || undefined);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async sendEmailWithPng(
    to: string,
    content: EmailContent,
    pngInfo: PngInfo,
  ): Promise<string | undefined> {
    try {
      const response = await this.sesClient.send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: [to],
          },
          FromEmailAddress: NO_REPLY_EMAIL,
          Content: {
            Raw: {
              Data: this.textEncoder.encode(
                generateMimeEmailWithPng(NO_REPLY_EMAIL, to, content, pngInfo),
              ),
            },
          },
        }),
      );
      return Promise.resolve(response.MessageId || undefined);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
