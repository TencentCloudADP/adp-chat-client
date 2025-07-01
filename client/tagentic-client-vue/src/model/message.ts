interface MessageBase {
    type: string;
    payload: any;
    message_id: string;
}

export interface ReplyMessage extends MessageBase {
    type: "reply";
    payload: {
        can_feedback: boolean;
        can_rating: boolean;
        content: string;
        docs: null;
        extra_info: {
            e_charts_info: null;
        };
        file_infos: null;
        from_avatar: string;
        from_name: string;
        intent_category: string;
        interrupt_info: null;
        is_evil: boolean;
        is_final: boolean;
        is_from_self: boolean;
        is_llm_generated: boolean;
        knowledge: null;
        option_cards: null;
        quote_infos: null;
        record_id: string;
        related_record_id: string;
        reply_method: number;
        request_id: string;
        session_id: string;
        timestamp: number;
        trace_id: string;
    };
}

interface Procedure {
    agent_icon: string;
    debugging: {
        content: string;
    };
    elapsed: number;
    icon: string;
    index: number;
    name: string;
    node_name: string;
    plugin_type: number;
    reply_index: number;
    source_agent_name: string;
    status: string;
    switch: string;
    target_agent_name: string;
    title: string;
    workflow_name: string;
}

export interface ThoughtMessage extends MessageBase {
    type: "thought";
    payload: {
        elapsed: number;
        files: null;
        is_workflow: boolean;
        procedures: Procedure[];
        record_id: string;
        request_id: string;
        session_id: string;
        trace_id: string;
        workflow_name: string;
    };
}

export type Message = ReplyMessage | ThoughtMessage;
