export enum Sender {
  React,
  Content,
}

export interface ChromeMessage {
  from: Sender;
  message: any;
}

export interface Project {
  _id: string;
  title: string;
  desc?: string;
  contributors: any[];
  owner: string;
  base_url: string;
}
export interface Bug {
  _id: string;
  title: string;
  identifier: string;
  desc: string;
  contributors: any[];
  owner: string;
  url: string;
  in: string;
  createdBy: string;
}
