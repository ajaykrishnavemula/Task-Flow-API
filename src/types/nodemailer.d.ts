declare module 'nodemailer' {
  interface Transport {
    sendMail(mailOptions: MailOptions): Promise<any>;
  }

  interface MailOptions {
    from?: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: Attachment[];
  }

  interface Attachment {
    filename?: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
    cid?: string;
  }

  interface TransportOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  }

  function createTransport(options: TransportOptions): Transport;

  export { createTransport, Transport, MailOptions, TransportOptions };
}

// Made with Bob
