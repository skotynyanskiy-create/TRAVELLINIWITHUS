import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Loader2, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEO from '../../components/SEO';
import {
  siteContentDefaults,
  siteContentDefinitionsById,
  type SiteContentFieldDefinition,
  type SiteContentKey,
} from '../../config/siteContent';
import { fetchSiteContent, logActivity, saveSiteContent } from '../../services/firebaseService';
import { useAuth } from '../../context/AuthContext';

type EditableState = Record<string, unknown>;

function cloneDefaults<K extends SiteContentKey>(key: K) {
  return JSON.parse(JSON.stringify(siteContentDefaults[key])) as EditableState;
}

function createEmptyObject(field: SiteContentFieldDefinition) {
  return Object.fromEntries((field.fields ?? []).map((item) => [item.key, ''])) as Record<string, string>;
}

export default function SiteContentEditor() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isPreviewMode = !user;

  const definition = pageId ? siteContentDefinitionsById[pageId as SiteContentKey] : undefined;
  const validPageId = definition?.id;

  const [formState, setFormState] = useState<EditableState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const pageTitle = useMemo(() => {
    if (!definition) {
      return 'Editor contenuti';
    }

    return `${definition.title} | Editor admin`;
  }, [definition]);

  useEffect(() => {
    const load = async () => {
      if (!validPageId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const remoteContent = await fetchSiteContent(validPageId);
        setFormState({
          ...cloneDefaults(validPageId),
          ...(remoteContent ?? {}),
        });
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [validPageId]);

  const updateField = (key: string, value: unknown) => {
    setFormState((prev) => ({
      ...(prev ?? {}),
      [key]: value,
    }));
  };

  const handleStringListChange = (key: string, index: number, value: string) => {
    setFormState((prev) => {
      const currentList = Array.isArray(prev?.[key]) ? ([...(prev?.[key] as string[])] as string[]) : [];
      currentList[index] = value;
      return { ...(prev ?? {}), [key]: currentList };
    });
  };

  const handleAddStringItem = (field: SiteContentFieldDefinition) => {
    setFormState((prev) => {
      const currentList = Array.isArray(prev?.[field.key]) ? ([...(prev?.[field.key] as string[])] as string[]) : [];
      currentList.push('');
      return { ...(prev ?? {}), [field.key]: currentList };
    });
  };

  const handleRemoveStringItem = (key: string, index: number) => {
    setFormState((prev) => {
      const currentList = Array.isArray(prev?.[key]) ? ([...(prev?.[key] as string[])] as string[]) : [];
      currentList.splice(index, 1);
      return { ...(prev ?? {}), [key]: currentList };
    });
  };

  const handleObjectListChange = (key: string, index: number, fieldKey: string, value: string) => {
    setFormState((prev) => {
      const currentList = Array.isArray(prev?.[key])
        ? ([...(prev?.[key] as Array<Record<string, string>>)] as Array<Record<string, string>>)
        : [];
      currentList[index] = {
        ...(currentList[index] ?? {}),
        [fieldKey]: value,
      };
      return { ...(prev ?? {}), [key]: currentList };
    });
  };

  const handleAddObjectItem = (field: SiteContentFieldDefinition) => {
    setFormState((prev) => {
      const currentList = Array.isArray(prev?.[field.key])
        ? ([...(prev?.[field.key] as Array<Record<string, string>>)] as Array<Record<string, string>>)
        : [];
      currentList.push(createEmptyObject(field));
      return { ...(prev ?? {}), [field.key]: currentList };
    });
  };

  const handleRemoveObjectItem = (key: string, index: number) => {
    setFormState((prev) => {
      const currentList = Array.isArray(prev?.[key])
        ? ([...(prev?.[key] as Array<Record<string, string>>)] as Array<Record<string, string>>)
        : [];
      currentList.splice(index, 1);
      return { ...(prev ?? {}), [key]: currentList };
    });
  };

  const handleReset = () => {
    if (!validPageId) {
      return;
    }

    setFormState(cloneDefaults(validPageId));
    setSaveMessage('Bozza ripristinata ai valori base. Salva per pubblicare le modifiche.');
  };

  const handleSave = async () => {
    if (!validPageId || !formState || !definition || !user) {
      return;
    }

    setSaving(true);
    setSaveMessage('');
    try {
      const payload = formState as never;
      await saveSiteContent(validPageId, payload);
      await logActivity('Contenuto pagina aggiornato', user.email || 'Admin', definition.title);
      await queryClient.invalidateQueries({ queryKey: ['site-content', validPageId] });
      setSaveMessage('Contenuto salvato correttamente. La pagina pubblica usera questi dati.');
    } catch (error) {
      console.error('Error saving site content:', error);
      setSaveMessage('Salvataggio non riuscito. Controlla la configurazione Firebase e riprova.');
    } finally {
      setSaving(false);
    }
  };

  if (!definition) {
    return (
      <PageLayout>
        <Section className="pt-32 pb-24">
          <div className="mx-auto max-w-3xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <h1 className="mb-4 text-3xl font-serif">Sezione non trovata</h1>
            <p className="mb-8 text-black/60">L editor richiesto non esiste o non e ancora stato configurato.</p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent)]"
            >
              <ArrowLeft size={16} /> Torna alla dashboard
            </Link>
          </div>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO title={pageTitle} description={`Editor admin per ${definition.title}`} noindex />

      <Section className="pt-32 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Link
                to="/admin"
                className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/40 transition-colors hover:text-[var(--color-accent)]"
              >
                <ArrowLeft size={14} /> Torna alla dashboard
              </Link>
              <h1 className="mb-3 text-4xl font-serif">{definition.title}</h1>
              <p className="max-w-3xl text-black/60">{definition.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:border-black/30"
              >
                <RotateCcw size={14} /> Ripristina base
              </button>
              <button
                type="button"
                onClick={() => navigate(definition.previewPath)}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:border-black/30"
              >
                <ExternalLink size={14} /> Anteprima pagina
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading || !formState || isPreviewMode}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-ink)]/85 disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Salva modifiche
              </button>
            </div>
          </div>

          {isPreviewMode && (
            <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-800 shadow-sm">
              Modalita anteprima admin locale attiva. Puoi vedere struttura, campi e flusso editoriale, ma il salvataggio resta bloccato finche non completi il login admin reale.
            </div>
          )}

          {saveMessage && (
            <div className="mb-8 rounded-2xl border border-black/5 bg-white px-6 py-4 text-sm text-black/70 shadow-sm">
              {saveMessage}
            </div>
          )}

          {loading || !formState ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader2 size={32} className="animate-spin text-[var(--color-accent)]" />
            </div>
          ) : (
            <div className="space-y-8">
              {definition.fields.map((field) => {
                const value = formState[field.key];

                if (field.type === 'text' || field.type === 'url') {
                  return (
                    <div key={field.key} className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
                      <label className="mb-3 block text-sm font-semibold text-black">{field.label}</label>
                      {field.description && <p className="mb-4 text-sm text-black/50">{field.description}</p>}
                      <input
                        type="text"
                        value={typeof value === 'string' ? value : ''}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        className="w-full rounded-2xl border border-black/10 bg-[var(--color-sand)] px-5 py-4 text-sm outline-none transition-all focus:border-[var(--color-accent)]"
                      />
                    </div>
                  );
                }

                if (field.type === 'boolean') {
                  const isEnabled = value === true;
                  return (
                    <div key={field.key} className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-black">{field.label}</label>
                          {field.description && <p className="text-sm text-black/50">{field.description}</p>}
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isEnabled}
                          onClick={() => updateField(field.key, !isEnabled)}
                          className={`inline-flex min-w-[130px] items-center justify-center rounded-full px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                            isEnabled
                              ? 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-accent)]'
                              : 'border border-black/10 bg-white text-black hover:border-black/30'
                          }`}
                        >
                          {isEnabled ? 'Attivo' : 'Disattivo'}
                        </button>
                      </div>
                    </div>
                  );
                }

                if (field.type === 'textarea') {
                  return (
                    <div key={field.key} className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
                      <label className="mb-3 block text-sm font-semibold text-black">{field.label}</label>
                      {field.description && <p className="mb-4 text-sm text-black/50">{field.description}</p>}
                      <textarea
                        rows={field.rows ?? 4}
                        value={typeof value === 'string' ? value : ''}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        className="w-full rounded-2xl border border-black/10 bg-[var(--color-sand)] px-5 py-4 text-sm outline-none transition-all focus:border-[var(--color-accent)]"
                      />
                    </div>
                  );
                }

                if (field.type === 'string-list') {
                  const items = Array.isArray(value) ? (value as string[]) : [];
                  return (
                    <div key={field.key} className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
                      <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold text-black">{field.label}</h2>
                          {field.description && <p className="mt-1 text-sm text-black/50">{field.description}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddStringItem(field)}
                          className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:border-black/30"
                        >
                          <Plus size={14} /> Aggiungi
                        </button>
                      </div>

                      <div className="space-y-4">
                        {items.map((item, index) => (
                          <div key={`${field.key}-${index}`} className="flex items-start gap-3">
                            <input
                              type="text"
                              value={item}
                              onChange={(event) => handleStringListChange(field.key, index, event.target.value)}
                              placeholder={field.itemLabel || 'Voce'}
                              className="w-full rounded-2xl border border-black/10 bg-[var(--color-sand)] px-5 py-4 text-sm outline-none transition-all focus:border-[var(--color-accent)]"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveStringItem(field.key, index)}
                              className="flex h-12 w-12 items-center justify-center rounded-full border border-red-100 text-red-500 transition-colors hover:border-red-200 hover:bg-red-50"
                              aria-label={`Rimuovi ${field.itemLabel || 'voce'} ${index + 1}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                const items = Array.isArray(value) ? (value as Array<Record<string, string>>) : [];
                return (
                  <div key={field.key} className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-black">{field.label}</h2>
                        {field.description && <p className="mt-1 text-sm text-black/50">{field.description}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddObjectItem(field)}
                        className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:border-black/30"
                      >
                        <Plus size={14} /> Aggiungi
                      </button>
                    </div>

                    <div className="space-y-6">
                      {items.map((item, index) => (
                        <div key={`${field.key}-${index}`} className="rounded-2xl border border-black/5 bg-[var(--color-sand)] p-6">
                          <div className="mb-4 flex items-center justify-between gap-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-black/50">
                              {field.itemLabel || 'Elemento'} {index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() => handleRemoveObjectItem(field.key, index)}
                              className="inline-flex items-center gap-2 rounded-full border border-red-100 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 transition-colors hover:border-red-200 hover:bg-red-50"
                            >
                              <Trash2 size={12} /> Rimuovi
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {(field.fields ?? []).map((nestedField) => (
                              <div
                                key={`${field.key}-${index}-${nestedField.key}`}
                                className={nestedField.type === 'textarea' ? 'md:col-span-2' : ''}
                              >
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-black/50">
                                  {nestedField.label}
                                </label>
                                {nestedField.type === 'textarea' ? (
                                  <textarea
                                    rows={nestedField.rows ?? 3}
                                    value={item[nestedField.key] ?? ''}
                                    onChange={(event) =>
                                      handleObjectListChange(field.key, index, nestedField.key, event.target.value)
                                    }
                                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--color-accent)]"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={item[nestedField.key] ?? ''}
                                    onChange={(event) =>
                                      handleObjectListChange(field.key, index, nestedField.key, event.target.value)
                                    }
                                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--color-accent)]"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Section>
    </PageLayout>
  );
}
