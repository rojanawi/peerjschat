import { useState } from 'react';
import { IMessageService } from '../domain/ports';
import { Message } from '../domain/types';

export class MessageService implements IMessageService {
  private messages: Message[] = [];

  addMessage(message: Message): void {
    this.messages = [...this.messages, message];
  }

  getMessages(): Message[] {
    return this.messages;
  }

  clearMessages(): void {
    this.messages = [];
  }
} 