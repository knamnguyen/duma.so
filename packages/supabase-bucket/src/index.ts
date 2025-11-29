import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

type UploadArgs = {
  bucket: string;
  path: string;
  data: ArrayBuffer | Buffer | Blob;
  contentType: string;
};

const getServerClient = (): SupabaseClient => {
  const url = process.env.SUPABASE_URL!;
  const secret = process.env.SUPABASE_SECRET_KEY!;
  return createClient(url, secret, { auth: { persistSession: false } });
};

const getPublicClient = (): SupabaseClient => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
};

const uploadPublic = async ({
  bucket,
  path,
  data,
  contentType,
}: UploadArgs) => {
  const supabase = getServerClient();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, data, { contentType, upsert: true });
  if (error) throw error;
  const url = getPublicUrl({ bucket, path });
  return { path, url } as const;
};

const getPublicUrl = ({ bucket, path }: { bucket: string; path: string }) => {
  const supabase = getPublicClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export { getServerClient, getPublicClient, uploadPublic, getPublicUrl };
