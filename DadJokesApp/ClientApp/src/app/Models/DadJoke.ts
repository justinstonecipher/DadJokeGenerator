export class DadJoke {
    public id: string;
    public joke: string;
    public status: string;

    public constructor(
        fields?: Partial<DadJoke>
    ) {
        if (fields) {
            Object.assign(this, fields);
        }
    }
}

