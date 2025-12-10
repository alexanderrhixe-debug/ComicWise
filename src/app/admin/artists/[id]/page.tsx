"use client";

import EditArtistForm from "./EditArtistForm";

export default function Page({ params }: { params: { id: string } }) {
  // Simple client wrapper that delegates to the form component
  return <EditArtistForm params={params} />;
}
