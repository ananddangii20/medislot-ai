type SuggestedQuestionsProps = {
    questions: string[];
    onSelect: (question: string) => void;
    onSendNow?: (question: string) => void;
};

const chipStyles = [
    "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
    "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
    "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
    "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
];

export function SuggestedQuestions({ questions, onSelect, onSendNow }: SuggestedQuestionsProps) {
    return (
        <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-2">Suggested questions</p>
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                {questions.map((question, idx) => (
                    <button
                        key={question}
                        type="button"
                        onClick={() => onSelect(question)}
                        onDoubleClick={() => onSendNow?.(question)}
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${chipStyles[idx % chipStyles.length]}`}
                    >
                        {question}
                    </button>
                ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Tap once to fill. Double tap to send.</p>
        </div>
    );
}
