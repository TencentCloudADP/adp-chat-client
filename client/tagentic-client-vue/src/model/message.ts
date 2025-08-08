interface MessageBase {
    type: string;
    payload: any;
    message_id: string;
}

interface QuoteInfo {
  index: number;
  position: number;
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
        option_cards: string[];
        quote_infos: QuoteInfo[];
        record_id: string;
        related_record_id: string;
        reply_method: number;
        request_id: string;
        session_id: string;
        timestamp: number;
        trace_id: string;
    };
}

interface Debugging {
    content?: string;
    display_content: string;
    agent?: Record<string, unknown>;
    task_flow?: Record<string, unknown>;
    work_flow?: {
        option_card_index?: Record<string, unknown>;
        run_nodes?: Array<{
            cost_milli_seconds?: number;
            input?: string;
            is_current?: boolean;
            node_id?: string;
            node_name?: string;
            node_type?: number;
            output?: string;
            status?: number;
            statistic_infos?: Array<{
                first_token_cost?: number;
                input_tokens?: number;
                model_name?: string;
                output_tokens?: number;
                total_cost?: number;
                total_tokens?: number;
            }>;
            task_output?: string;
        }>;
        workflow_id?: string;
        workflow_name?: string;
        workflow_release_time?: number;
        workflow_run_id?: string;
    };
}

interface Procedure {
    agent_icon: string;
    debugging: Debugging;
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

interface Reference {
    doc_biz_id: string;
    doc_id: string;
    doc_name: string;
    id: string;
    name: string;
    qa_biz_id: string;
    type: number;
    url: string;
}

export interface ReferenceMessage extends MessageBase {
    type: "reference";
    payload: {
        record_id: string;
        references: Reference[];
        trace_id: string;
    }
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

export interface TokenStatMessage extends MessageBase {
    type: "token_stat";
    payload: {
        elapsed: number;
        free_count: number;
        order_count: number;
        procedures: Array<{
            count?: number;
            debugging?: Debugging;
            input_count?: number;
            name?: string;
            output_count?: number;
            resource_status?: number;
            status?: string;
            title?: string;
        }>;
        record_id: string;
        request_id: string;
        session_id: string;
        status_summary: string;
        status_summary_title: string;
        token_count: number;
        trace_id: string;
        used_count: number;
    };
}

export type Message = ReferenceMessage | ReplyMessage | ThoughtMessage | TokenStatMessage;
