export type UserType = {
	id: string;
	fullName: string;
	email: string;
};

export type LogType = {
	Events: Array<{
		Properties?: Array<{
			Name: string;
			Value: string | number | { Id: number | null; Name: string };
		}>;
		Timestamp: string;
		MessageTemplateTokens: {
			Text?: string;
			PropertyName?: string;
		}[];
		EventType: string;
		Level: string;
		TraceId: string;
		SpanId: string;
		SpanKind: string;
		Id: string;
		Links: {
			Self: string;
			Group: string;
		};
	}>;
};

export type SingleUserType = {
	fullName: string;
	email: string;
};
