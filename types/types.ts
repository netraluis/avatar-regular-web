import { ChangeEvent, KeyboardEvent } from "react";
import { File } from "@prisma/client";

export interface TextAreaFormProps {
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  input: string;
  submitMessage: () => void;
  loading: boolean;
  status: string;
  showFooter?: boolean;
}

export interface Option {
  id: string;
  name: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  [key: string]: any;
}

// export type ChatModel =
//   | 'o1-preview'
//   | 'o1-preview-2024-09-12'
//   | 'o1-mini'
//   | 'o1-mini-2024-09-12'
//   | 'gpt-4o'
//   | 'gpt-4o-2024-08-06'
//   | 'gpt-4o-2024-05-13'
//   | 'chatgpt-4o-latest'
//   | 'gpt-4o-mini'
//   | 'gpt-4o-mini-2024-07-18'
//   | 'gpt-4-turbo'
//   | 'gpt-4-turbo-2024-04-09'
//   | 'gpt-4-0125-preview'
//   | 'gpt-4-turbo-preview'
//   | 'gpt-4-1106-preview'
//   | 'gpt-4-vision-preview'
//   | 'gpt-4'
//   | 'gpt-4-0314'
//   | 'gpt-4-0613'
//   | 'gpt-4-32k'
//   | 'gpt-4-32k-0314'
//   | 'gpt-4-32k-0613'
//   | 'gpt-3.5-turbo'
//   | 'gpt-3.5-turbo-16k'
//   | 'gpt-3.5-turbo-0301'
//   | 'gpt-3.5-turbo-0613'
//   | 'gpt-3.5-turbo-1106'
//   | 'gpt-3.5-turbo-0125'
//   | 'gpt-3.5-turbo-16k-0613';

export enum ChatModel {
  O1PREVIEW = "o1-preview",
  O1MINI = "o1-mini",
  GPT4O = "gpt-4o",
  GPT4OMINI = "gpt-4o-mini",
  GPT4TURBO = "gpt-4-turbo",
  GPT3 = "gpt-3.5-turbo",
  GPT4 = "gpt-4",
  // DAVINCI = "davinci",
}

export type VectorStoreFile = File & { isCharging: boolean };

export interface SuccessfullResponse<T> {
  status: number;
  data: T;
}

export enum FileUserImageType {
  LOGO = "logo",
  SYMBOL = "symbol",
  AVATAR = "avatar",
}

interface UserMetadata {
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
}

// Definición de tipos para las identidades del usuario
interface Identity {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: UserMetadata;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
}

interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmation_sent_at: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: UserMetadata;
  identities: Identity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

// Definición de tipos para la sesión del usuario
interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User;
}

export interface UserData {
  user: User;
  session: Session;
}
