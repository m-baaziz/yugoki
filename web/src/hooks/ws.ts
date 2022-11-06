import { useState, useEffect } from 'react';
import { SiteChatMessage } from '../generated/graphql';
import config from '../config';

export type WsData = {
  action: 'connect' | 'disconnect';
  token?: string;
};

export type MessageHandler = {
  handler: (message: SiteChatMessage) => void;
};

export type WsHookReturnType = {
  connect: () => void;
  disconnect: () => void;
  setNewMessageHandler: (handler: MessageHandler) => void;
};

function sendData(ws: WebSocket, data: WsData): void {
  ws.send(JSON.stringify(data));
}

export function useWsHandlers(
  newMessageHandlerInit?: MessageHandler,
): WsHookReturnType {
  const [newMessageHandler, setNewMessageHandler] = useState<
    MessageHandler | undefined
  >(newMessageHandlerInit);
  const [ws, setWs] = useState<WebSocket | undefined>(undefined);
  const [isWsOpen, setIsWsOpen] = useState(false);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [ws]);

  useEffect(() => {
    if (!ws || !newMessageHandler) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (event: MessageEvent<any>) => {
      if (newMessageHandler) {
        newMessageHandler.handler(JSON.parse(event.data.toString()));
      }
    };

    ws.addEventListener('message', listener);

    return () => {
      if (ws) {
        ws.removeEventListener('message', listener);
      }
    };
  }, [newMessageHandler, ws]);

  const connect = () => {
    if (ws && isWsOpen) return;
    const token = localStorage.getItem(config.tokenCacheKey);
    if (!token) {
      console.error('Cannot connect to ws server when not signed in');
      return;
    }
    const newWs = new WebSocket(config.wsEndpoint);
    newWs.addEventListener('open', () => {
      sendData(newWs, { action: 'connect', token });
      setIsWsOpen(true);
    });

    newWs.addEventListener('close', () => {
      setIsWsOpen(false);
    });

    setWs(newWs);
  };

  const disconnect = () => {
    if (ws && isWsOpen) {
      sendData(ws, { action: 'disconnect' });
      ws.close();
    }
  };

  return { connect, disconnect, setNewMessageHandler };
}
