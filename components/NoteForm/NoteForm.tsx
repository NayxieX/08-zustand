import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { NoteTag } from "../../types/note";
import { useCreateNote } from "../../hooks/useCreateNote";

interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  onCancel: () => void;
  onSubmit?: () => void;
}

const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Max length is 500 characters"),
  tag: Yup.string<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

const NoteForm = ({ onCancel, onSubmit }: NoteFormProps) => {
  const { mutate, isPending, error } = useCreateNote(onCancel);

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        mutate(values, {
          onSuccess: () => {
            resetForm();
            onSubmit?.(); 
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
              />
              <FormikError
                name="content"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field as="select" id="tag" name="tag" className={css.select}>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <FormikError name="tag" component="span" className={css.error} />
            </div>

            {error && (
              <div className={css.error}>
                {(error as Error).message || "Failed to create note"}
              </div>
            )}

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onCancel}
              >
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
};

export default NoteForm;
