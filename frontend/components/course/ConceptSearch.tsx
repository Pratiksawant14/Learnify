'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, BookOpen, ChevronRight, PlayCircle } from 'lucide-react';

interface ConceptSearchProps {
    roadmap: any;
    onLessonSelect: (lessonId: string) => void;
}

interface SearchResult {
    type: 'concept' | 'lesson';
    title: string;
    subtitle: string;
    lessonId: string;
}

export default function ConceptSearch({ roadmap, onLessonSelect }: ConceptSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (term: string) => {
        setQuery(term);
        if (term.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const matches: SearchResult[] = [];
        const lowerTerm = term.toLowerCase();

        // Search logic: traverse roadmap
        roadmap?.units?.forEach((unit: any) => {
            unit.chapters?.forEach((chapter: any) => {
                // Check Chapter matches
                if (chapter.title.toLowerCase().includes(lowerTerm)) {
                    // Start from first lesson if chapter matches
                    const firstLesson = chapter.lessons?.[0];
                    if (firstLesson) {
                        matches.push({
                            type: 'concept',
                            title: chapter.title,
                            subtitle: `Chapter in ${unit.title}`,
                            lessonId: firstLesson.id
                        });
                    }
                }

                // Check Lesson matches
                chapter.lessons?.forEach((lesson: any) => {
                    if (lesson.title.toLowerCase().includes(lowerTerm) ||
                        lesson.description?.toLowerCase().includes(lowerTerm)) {
                        matches.push({
                            type: 'lesson',
                            title: lesson.title,
                            subtitle: `${chapter.title} • ${lesson.duration}`,
                            lessonId: lesson.id
                        });
                    }
                });
            });
        });

        setResults(matches.slice(0, 8)); // Limit results
        setIsOpen(true);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md">
            <div className={`relative flex items-center bg-slate-800/50 border transition-all rounded-lg ${isOpen ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-slate-700 hover:border-slate-600'}`}>
                <Search className="ml-3 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="Search concepts across roadmap..."
                    className="w-full bg-transparent border-none text-sm text-white px-3 py-2.5 focus:outline-none placeholder:text-slate-500"
                />
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                    <div className="py-2">
                        <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Found {results.length} results
                        </div>
                        {results.map((result, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    onLessonSelect(result.lessonId);
                                    setIsOpen(false);
                                    setQuery("");
                                }}
                                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-800 transition-colors text-left group"
                            >
                                <div className={`mt-0.5 p-1.5 rounded-md ${result.type === 'concept' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                    {result.type === 'concept' ? <BookOpen className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                                        {result.title}
                                    </div>
                                    <div className="text-xs text-slate-500 group-hover:text-slate-400">
                                        {result.subtitle}
                                    </div>
                                </div>
                                <ChevronRight className="ml-auto w-4 h-4 text-slate-600 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isOpen && query.length >= 2 && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-4 text-center text-slate-500 text-sm">
                    No concepts found for "{query}"
                </div>
            )}
        </div>
    );
}
