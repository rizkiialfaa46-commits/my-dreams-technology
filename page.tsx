"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase-browser";

type Roadmap = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  position: number;
};

export default function RoadmapPage() {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const supabase = createClient();

  useEffect(() => {
    loadRoadmaps();
  }, []);

  async function loadRoadmaps() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true });

    if (error) {
      console.error(error);
      alert("Gagal mengambil Roadmap");
    } else {
      setRoadmaps(data || []);
    }

    setLoading(false);
  }

  async function addRoadmap() {
    if (!newTitle.trim()) {
      alert("Judul Roadmap wajib diisi");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("roadmaps").insert({
      user_id: user.id,
      title: newTitle.trim(),
      description: newDescription.trim() || null,
      status: "pending",
      position: roadmaps.length,
    });

    if (error) {
      console.error(error);
      alert("Gagal membuat Roadmap: " + error.message);
      return;
    }

    setNewTitle("");
    setNewDescription("");
    await loadRoadmaps();
  }

  async function changeStatus(id: string, status: string) {
    const { error } = await supabase
      .from("roadmaps")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Gagal mengubah status");
      return;
    }

    await loadRoadmaps();
  }

  async function deleteRoadmap(id: string) {
    if (!confirm("Hapus Roadmap ini?")) return;

    const { error } = await supabase
      .from("roadmaps")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Gagal menghapus Roadmap");
      return;
    }

    await loadRoadmaps();
  }

  if (loading) {
    return (
      <main className="shell">
        <div className="muted">Loading roadmap...</div>
      </main>
    );
  }

  return (
    <main className="shell">
      <header className="top">
        <div>
          <div className="eyebrow">MY DREAMS TECHNOLOGY</div>
          <h1>Roadmap</h1>
          <p className="muted">
            Susun langkah-langkah untuk mencapai Dream kamu.
          </p>
        </div>
      </header>

      <section className="card hero">
        <div className="eyebrow">YOUR JOURNEY</div>
        <h2>Build your roadmap 🚀</h2>
        <p className="muted">
          Pecah Dream besar menjadi beberapa langkah kecil yang jelas.
        </p>
      </section>

      <section className="card">
        <h2>Tambah Roadmap</h2>

        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <input
            className="input"
            placeholder="Judul langkah..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <textarea
            className="input"
            placeholder="Deskripsi langkah..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={4}
          />

          <button className="btn" onClick={addRoadmap}>
            + Tambah Roadmap
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Roadmap Saya</h2>

        {roadmaps.length === 0 ? (
          <p className="muted" style={{ marginTop: 16 }}>
            Belum ada roadmap. Buat langkah pertamamu!
          </p>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            {roadmaps.map((roadmap, index) => (
              <div
                key={roadmap.id}
                className="card"
                style={{ border: "1px solid rgba(255,255,255,.08)" }}
              >
                <div className="row">
                  <div>
                    <span className="muted">STEP {index + 1}</span>
                    <h3>{roadmap.title}</h3>

                    {roadmap.description && (
                      <p className="muted">{roadmap.description}</p>
                    )}
                  </div>

                  <span className="badge">{roadmap.status}</span>
                </div>

                <div className="row" style={{ marginTop: 14 }}>
                  <select
                    className="input"
                    value={roadmap.status}
                    onChange={(e) =>
                      changeStatus(roadmap.id, e.target.value)
                    }
                    style={{ maxWidth: 220 }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    className="btn"
                    onClick={() => deleteRoadmap(roadmap.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}