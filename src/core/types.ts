export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  regionId: string;
  title: string;
  body: string;
  createdAt: string;
  hearts: number;
  hearted?: boolean;
};

export type ModerationResult = {
  decision: 'APPROVED' | 'BLOCKED' | 'HOLD' | 'UNAVAILABLE';
  reasonCode?: 'WARM_STORY' | 'CRITICISM' | 'HARMFUL' | 'PRIVATE_INFO' | 'AMBIGUOUS';
};

export type Draft = { title: string; body: string; regionId: string };
export type DemoAlert = { id: string; text: string; read: boolean };
export type DemoMessage = { id: string; text: string; mine: boolean };

export type DemoController = {
  readOnly: boolean;
  posts: Post[];
  alerts: DemoAlert[];
  messages: DemoMessage[];
  publish(draft: Draft): Promise<ModerationResult>;
  toggleHeart(id: string): void;
  readAlert(id: string): void;
  sendMessage(text: string): void;
  reset(): void;
};
