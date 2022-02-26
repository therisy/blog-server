import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CONFIG } from "src/config";

@Injectable()
export class SupaBaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient("https://" + CONFIG.POSTGRES.HOST, CONFIG.SUPABASE.KEY)
    }

    async sendMail(): Promise<string> {
        return "test"
    }
}
