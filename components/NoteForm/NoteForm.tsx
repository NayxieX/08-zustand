"use client";

import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { useCreateNote } from "@/hooks/useCreateNote";
import { useNoteDraft } from "@/lib/store/noteStore";
import { tagOptions, Tag, NewNote } from "@/types/note";

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Max length is 500 characters"),
  tag: Yup.mixed<Tag>().oneOf(tagOptions).required("Tag is required"),
});

export default function NoteForm() {
  const { draft, updateDraft, clearDraft } = useNoteDraft();
  const { mutate, isPending, error } = useCreateNote(() => clearDraft());

  return (
    <Formik<NewNote>
      enableReinitialize
      initialValues={draft}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        mutate(values, {
          onSuccess: () => {
            resetForm();
            clearDraft();
          },
        });
      }}
    >
      {({ isValid, dirty }) => (
        <Form className={css.form}>
          <fieldset disabled={isPending} className={css.fieldset}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field
                id="title"
                name="title"
                type="text"
                className={css.input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateDraft({ title: e.target.value })
                }
              />
              <FormikError
                name="title"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                id="content"
                name="content"
                as="textarea"
                rows={8}
                className={css.textarea}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateDraft({ content: e.target.value })
                }
              />
              <FormikError
                name="content"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field
                as="select"
                id="tag"
                name="tag"
                className={css.select}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateDraft({ tag: e.target.value as Tag })
                }
              >
                {tagOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Field>
              <FormikError name="tag" component="span" className={css.error} />
            </div>

            {error && (
              <div className={css.error}>
                {(error as Error).message || "Failed to create note"}
              </div>
            )}

            <div className={css.actions}>
              <button type="button" className={css.cancelButton}>
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={!isValid || !dirty || isPending}
              >
                {isPending ? "Creating..." : "Create note"}
              </button>
            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
}
