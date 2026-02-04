
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const DebugAuth = () => {
    const [status, setStatus] = useState('Initializing...');
    const [sessionData, setSessionData] = useState(null);
    const [tests, setTests] = useState({});

    const runTests = async () => {
        setStatus('Running tests...');
        const newTests = {};

        // 1. Check Session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        setSessionData(session);
        newTests['Auth Session'] = session ? `✅ Logged in as ${session.user.email}` : '❌ No Session (Please Log In)';

        if (!session) {
            setTests(newTests);
            setStatus('Finished (Not Logged In)');
            return;
        }

        // 2. Test Select (Read)
        const { data: readData, error: readError } = await supabase.from('products').select('count').limit(1);
        newTests['Read Products'] = readError ? `❌ Failed: ${readError.message}` : '✅ Success';

        // 3. Test Insert (Write)
        const testProduct = { name: 'DEBUG_TEST', price: '0', category: 'test', image: 'test' };
        const { data: insertData, error: insertError } = await supabase.from('products').insert([testProduct]).select().single();
        newTests['Create Product'] = insertError ? `❌ Failed: ${insertError.message}` : '✅ Success';

        // 4. Test Delete
        if (!insertError && insertData) {
            const { error: deleteError } = await supabase.from('products').delete().eq('id', insertData.id);
            newTests['Delete Product'] = deleteError ? `❌ Failed: ${deleteError.message}` : '✅ Success';
        } else {
            newTests['Delete Product'] = '⚠️ Skipped (Insert Failed)';
        }

        setTests(newTests);
        setStatus('Diagnostics Complete');
    };

    useEffect(() => {
        runTests();
    }, []);

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-red-600">Admin Diagnostics</h1>

            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <h2 className="font-bold mb-2">Status: {status}</h2>
                <button onClick={runTests} className="bg-blue-600 text-white px-4 py-2 rounded">Re-run Tests</button>
            </div>

            <div className="space-y-4">
                {Object.entries(tests).map(([name, result]) => (
                    <div key={name} className={`p-4 border rounded-lg ${result.includes('✅') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <h3 className="font-bold">{name}</h3>
                        <p>{result}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h3 className="font-bold mb-2">Raw Session Data:</h3>
                <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-auto text-xs">
                    {JSON.stringify(sessionData, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default DebugAuth;
