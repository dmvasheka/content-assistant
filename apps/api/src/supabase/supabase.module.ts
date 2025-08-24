import { Module, Global } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Global()
@Module({
    providers: [
        {
            provide: 'SUPABASE_CLIENT',
            useFactory: (): SupabaseClient => {
                return createClient(
                    process.env.SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ сервисный ключ
                );
            },
        },
    ],
    exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}