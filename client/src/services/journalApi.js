import api from "./api";

const formatJournal = (journal, analysis = null) => {
  if (!journal) return null;

  return {
    id: journal._id,
    title: journal.title || "Untitled entry",
    content: journal.content || "",

    date: new Date(journal.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),

    excerpt:
      journal.content?.length > 140
        ? `${journal.content.slice(0, 140)}...`
        : journal.content || "",

    sentiment: analysis?.sentiment || "neutral",

    themes: Array.isArray(analysis?.themes)
      ? analysis.themes
      : [],

    emotions: Array.isArray(analysis?.emotions)
      ? analysis.emotions
      : [],

    insight:
      analysis?.insight ||
      analysis?.insights?.[0] ||
      "",

    insights: Array.isArray(analysis?.insights)
      ? analysis.insights
      : [],

    supportLevel: analysis?.supportLevel || null,

    analyzed: Boolean(analysis),
  };
};

export const createJournal = async ({ title, content }) => {
  const response = await api.post("/api/journals", {
    title,
    content,
  });

  const data = response.data?.data || response.data;

  return formatJournal(
    data?.journal,
    data?.analysis
  );
};

export const fetchJournals = async () => {
  const response = await api.get("/api/journals");

  const data = response.data?.data || response.data;

  const journals = data?.journals || [];

  return journals.map((journal) =>
    formatJournal(journal)
  );
};

export const fetchJournalById = async (id) => {
  const response = await api.get(`/api/journals/${id}`);

  const data = response.data?.data || response.data;

  return formatJournal(
    data?.journal,
    data?.analysis
  );
};

export const analyzeJournal = async (id) => {
  const response = await api.post(
    `/api/journals/${id}/analyze`
  );

  const data = response.data?.data || response.data;

  return formatJournal(
    data?.journal,
    data?.analysis
  );
};

export const updateJournal = async (
  id,
  title,
  content
) => {
  const response = await api.put(
    `/api/journals/${id}`,
    {
      title,
      content,
    }
  );

  const data = response.data?.data || response.data;

  return formatJournal(
    data?.journal,
    data?.analysis
  );
};

export const deleteJournal = async (id) => {
  return api.delete(`/api/journals/${id}`);
};