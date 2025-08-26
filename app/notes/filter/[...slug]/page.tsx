import { fetchNotes } from "@/lib/api";
import NotesClient from "@/app/notes/filter/[...slug]/Notes.client";
import { tagOptions, Tag } from "@/types/note";

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  const maybeTag = slug?.[0];
  const tag: Tag | undefined = tagOptions.includes(maybeTag as Tag)
    ? (maybeTag as Tag)
    : undefined;

  const data = await fetchNotes({
    page: 1,
    search: "",
    ...(tag ? { tag } : {}),
  });

  return <NotesClient initialData={data} selectedTag={tag} />;
}
