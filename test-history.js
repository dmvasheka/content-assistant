const { default: fetch } = require('node-fetch');

const API_BASE = 'http://localhost:3001';

async function testHistoryAPI() {
    console.log('🧪 Testing History API...\n');

    try {
        // 1. Test generation to create history entry
        console.log('1. Generating content to create history...');
        const generateResponse = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: 'Искусственный интеллект в образовании'
            }),
        });

        if (generateResponse.ok) {
            const generateResult = await generateResponse.json();
            console.log('✅ Generation created');
            console.log('Draft length:', generateResult.draft?.length || 0);
        } else {
            console.error('❌ Generation failed:', generateResponse.status);
        }

        // 2. Get generation history
        console.log('\n2. Fetching generation history...');
        const historyResponse = await fetch(`${API_BASE}/history?limit=5`, {
            method: 'GET',
        });

        if (historyResponse.ok) {
            const historyResult = await historyResponse.json();
            console.log(`✅ Retrieved ${historyResult.length} history records:`);
            historyResult.forEach((record, i) => {
                console.log(`${i + 1}. ${record.topic} (${record.citations?.length || 0} citations)`);
                console.log(`   ID: ${record.id}, Created: ${new Date(record.created_at).toLocaleString()}`);
            });
        } else {
            console.error('❌ History fetch failed:', historyResponse.status, await historyResponse.text());
        }

        // 3. Search history
        console.log('\n3. Searching history for "образование"...');
        const searchResponse = await fetch(`${API_BASE}/history/search?q=образование&limit=3`, {
            method: 'GET',
        });

        if (searchResponse.ok) {
            const searchResult = await searchResponse.json();
            console.log(`✅ Search found ${searchResult.length} records`);
            searchResult.forEach((record, i) => {
                console.log(`${i + 1}. ${record.topic}`);
            });
        } else {
            console.error('❌ Search failed:', searchResponse.status, await searchResponse.text());
        }

        // 4. Get specific generation by ID (if we have history)
        const allHistoryResponse = await fetch(`${API_BASE}/history?limit=1`);
        if (allHistoryResponse.ok) {
            const allHistory = await allHistoryResponse.json();
            if (allHistory.length > 0) {
                const firstRecord = allHistory[0];
                console.log(`\n4. Getting specific generation by ID: ${firstRecord.id}...`);

                const specificResponse = await fetch(`${API_BASE}/history/${firstRecord.id}`);
                if (specificResponse.ok) {
                    const specificResult = await specificResponse.json();
                    console.log('✅ Retrieved specific generation:');
                    console.log(`Topic: ${specificResult.topic}`);
                    console.log(`Citations: ${specificResult.citations?.length || 0}`);
                    console.log(`Draft preview: ${specificResult.draft.substring(0, 100)}...`);
                } else {
                    console.error('❌ Specific fetch failed:', specificResponse.status);
                }
            }
        }

    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

testHistoryAPI();