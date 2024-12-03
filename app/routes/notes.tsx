import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { type Note } from "@prisma/client";
import { getNoteListItems } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { LogoutButton } from "@/components/switches-toggles-buttons/logout-button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return Response.json({ noteListItems });
};

const EmptyNoteList = () => <p>No notes yet</p>;
const RenderNoteList = (noteListItems: Note[]) =>
  noteListItems.map((note: Note) => (
    <li key={note.id}>
      <Link className="active-link" to={note.id}>
        {`📝 ${note.title}`}
      </Link>
    </li>
  ));

const Switcher = (data?: Note[]) => {
  if (Array.isArray(data)) return <RenderNoteList {...data} />;
  return <EmptyNoteList />;
};
export default function NotesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <>
      <header>
        <h1>
          <Link to=".">Notes</Link>
        </h1>
        <p>{user.email}</p>
        <LogoutButton />
      </header>
      <main>
        <Link to="new">+ New Note</Link>
        <ol>{Switcher(data.noteListItems)}</ol>
        <Outlet />
      </main>
    </>
  );
}
