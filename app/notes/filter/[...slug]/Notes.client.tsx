"use client";

import css from "@/app/notes/filter/[...slug]/Notes.client.module.css";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";

import { Tag } from "@/types/note";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";

import { toast } from "react-hot-toast";

interface NotesClientProps {
  initialData: FetchNotesResponse;
  selectedTag?: Tag | undefined;
}

export default function NotesClient({
  initialData,
  selectedTag,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1200);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedTag]);

  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", currentPage, debouncedSearchQuery, selectedTag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        search: debouncedSearchQuery,
        ...(selectedTag ? { tag: selectedTag } : {}),
      }),
    initialData:
      currentPage === 1 && debouncedSearchQuery === "" && !selectedTag
        ? initialData
        : undefined,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // React Hot-Toasts
  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading notes...", { id: "notes-loading" });
    } else {
      toast.dismiss("notes-loading");
    }

    if (isError) {
      let message: string;
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response ===
          "object" &&
        (error as { response?: { status?: number } }).response?.status === 429
      ) {
        message = "Too many requests. Please wait a few seconds ⏳";
      } else {
        message = (error as Error)?.message ?? "Something went wrong.";
      }
      toast.error(message);
    }
  }, [isLoading, isError, error]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <div className={css.left}>
          <SearchBox value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className={css.center}>
          {data?.totalPages && data.totalPages > 1 && (
            <Pagination
              pageCount={data.totalPages}
              currentPage={currentPage - 1}
              onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            />
          )}
        </div>

        <div className={css.right}>
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        </div>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onCancel={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </header>

      {data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found</p>
      )}
    </div>
  );
}
