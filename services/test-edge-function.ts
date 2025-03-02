import { supabase } from "./initSupabase";

async function testEdgeFunction() {
  const { data, error } = await supabase.functions.invoke('fal-ai-webhook-handler', {
    body: { name: 'Functions' },
  });
  console.log(data);
}
export default testEdgeFunction;