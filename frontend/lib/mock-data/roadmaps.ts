export interface Roadmap {
    units: Unit[];
}

export interface Unit {
    id: string;
    title: string;
    chapters: Chapter[];
}

export interface Video {
    id: string;
    title: string;
    channel: string;
    duration: string;
    views?: string;      // e.g., "1.2K"
    rating?: number;     // e.g., 4.8
}

export interface Lesson {
    id: string;
    title: string;
    duration: string;  // e.g., "25 min"
    isLocked: boolean; // visual only, no logic
    videos?: Video[];  // videos for this lesson
}

export interface Chapter {
    id: string;
    title: string;
    description?: string;
    learningPoints?: string[];
    estimatedTime?: string;
    videos?: Video[];
    lessons?: Lesson[];
    keyPoints?: string[];  // for chapter info panel
}

// Mock roadmap generator based on course topic
export function generateMockRoadmap(courseTopic: string): Roadmap {
    // For JavaScript courses, return comprehensive roadmap
    if (courseTopic.toLowerCase().includes('javascript') || courseTopic.toLowerCase().includes('js')) {
        return getJavaScriptRoadmap();
    }

    // Generic roadmap for other topics
    return {
        units: [
            {
                id: 'unit-1',
                title: 'Unit 1: Fundamentals',
                chapters: [
                    {
                        id: 'ch-1-1',
                        title: 'Chapter 1: Introduction',
                        lessons: [
                            { id: 'ch-1-1-l1', title: 'Getting Started', duration: '15 min', isLocked: false },
                            { id: 'ch-1-1-l2', title: 'Key Concepts', duration: '20 min', isLocked: true },
                            { id: 'ch-1-1-l3', title: 'First Steps', duration: '18 min', isLocked: true }
                        ]
                    },
                    {
                        id: 'ch-1-2',
                        title: 'Chapter 2: Core Concepts',
                        lessons: [
                            { id: 'ch-1-2-l1', title: 'Understanding Basics', duration: '22 min', isLocked: false },
                            { id: 'ch-1-2-l2', title: 'Core Principles', duration: '25 min', isLocked: true },
                            { id: 'ch-1-2-l3', title: 'Practical Examples', duration: '20 min', isLocked: true }
                        ]
                    },
                    {
                        id: 'ch-1-3',
                        title: 'Chapter 3: Basic Syntax',
                        lessons: [
                            { id: 'ch-1-3-l1', title: 'Syntax Overview', duration: '18 min', isLocked: false },
                            { id: 'ch-1-3-l2', title: 'Common Patterns', duration: '20 min', isLocked: true },
                            { id: 'ch-1-3-l3', title: 'Best Practices', duration: '15 min', isLocked: true }
                        ]
                    },
                ]
            },
            {
                id: 'unit-2',
                title: 'Unit 2: Intermediate Concepts',
                chapters: [
                    {
                        id: 'ch-2-1',
                        title: 'Chapter 4: Applied Techniques',
                        lessons: [
                            { id: 'ch-2-1-l1', title: 'Technique Fundamentals', duration: '25 min', isLocked: false },
                            { id: 'ch-2-1-l2', title: 'Advanced Applications', duration: '30 min', isLocked: true },
                            { id: 'ch-2-1-l3', title: 'Real-world Scenarios', duration: '28 min', isLocked: true }
                        ]
                    },
                    {
                        id: 'ch-2-2',
                        title: 'Chapter 5: Real-world Usage',
                        lessons: [
                            { id: 'ch-2-2-l1', title: 'Practical Implementation', duration: '30 min', isLocked: false },
                            { id: 'ch-2-2-l2', title: 'Case Studies', duration: '35 min', isLocked: true },
                            { id: 'ch-2-2-l3', title: 'Problem Solving', duration: '25 min', isLocked: true }
                        ]
                    },
                    {
                        id: 'ch-2-3',
                        title: 'Chapter 6: Best Practices',
                        lessons: [
                            { id: 'ch-2-3-l1', title: 'Industry Standards', duration: '20 min', isLocked: false },
                            { id: 'ch-2-3-l2', title: 'Code Quality', duration: '22 min', isLocked: true },
                            { id: 'ch-2-3-l3', title: 'Optimization Tips', duration: '18 min', isLocked: true }
                        ]
                    },
                ]
            },
            {
                id: 'unit-3',
                title: 'Unit 3: Advanced Topics',
                chapters: [
                    {
                        id: 'ch-3-1',
                        title: 'Chapter 7: Advanced Patterns',
                        lessons: [
                            { id: 'ch-3-1-l1', title: 'Design Patterns', duration: '35 min', isLocked: false },
                            { id: 'ch-3-1-l2', title: 'Architectural Concepts', duration: '40 min', isLocked: true },
                            { id: 'ch-3-1-l3', title: 'Advanced Techniques', duration: '38 min', isLocked: true }
                        ]
                    },
                    {
                        id: 'ch-3-2',
                        title: 'Chapter 8: Performance Optimization',
                        lessons: [
                            { id: 'ch-3-2-l1', title: 'Performance Basics', duration: '25 min', isLocked: false },
                            { id: 'ch-3-2-l2', title: 'Optimization Strategies', duration: '30 min', isLocked: true },
                            { id: 'ch-3-2-l3', title: 'Benchmarking', duration: '28 min', isLocked: true },
                            { id: 'ch-3-2-l4', title: 'Profiling Tools', duration: '22 min', isLocked: true }
                        ]
                    },
                ]
            },
            {
                id: 'unit-4',
                title: 'Unit 4: Professional Mastery',
                chapters: [
                    {
                        id: 'ch-4-1',
                        title: 'Chapter 9: Industry Standards',
                        lessons: [
                            { id: 'ch-4-1-l1', title: 'Professional Practices', duration: '30 min', isLocked: false },
                            { id: 'ch-4-1-l2', title: 'Team Collaboration', duration: '25 min', isLocked: true },
                            { id: 'ch-4-1-l3', title: 'Code Review', duration: '20 min', isLocked: true }
                        ]
                    },
                    {
                        id: 'ch-4-2',
                        title: 'Chapter 10: Project Development',
                        lessons: [
                            { id: 'ch-4-2-l1', title: 'Project Planning', duration: '35 min', isLocked: false },
                            { id: 'ch-4-2-l2', title: 'Implementation', duration: '45 min', isLocked: true },
                            { id: 'ch-4-2-l3', title: 'Testing & Deployment', duration: '40 min', isLocked: true }
                        ]
                    },
                    {
                        id: 'ch-4-3',
                        title: 'Chapter 11: Final Assessment',
                        lessons: [
                            { id: 'ch-4-3-l1', title: 'Review & Recap', duration: '30 min', isLocked: false },
                            { id: 'ch-4-3-l2', title: 'Capstone Project', duration: '60 min', isLocked: true },
                            { id: 'ch-4-3-l3', title: 'Next Steps', duration: '15 min', isLocked: true }
                        ]
                    },
                ]
            }
        ]
    };
}

// Comprehensive JavaScript roadmap
function getJavaScriptRoadmap(): Roadmap {
    return {
        units: [
            {
                id: 'intro',
                title: 'Introduction',
                chapters: [
                    {
                        id: 'prereq',
                        title: 'Prerequisites: VS Code, HTML/CSS basics',
                        description: 'Get your development environment ready and ensure you have the foundational knowledge needed to start learning JavaScript.',
                        learningPoints: [
                            'Install and configure VS Code',
                            'Understand basic HTML structure',
                            'Know CSS fundamentals',
                            'Set up browser developer tools'
                        ],
                        estimatedTime: '45 mins',
                        videos: [
                            {
                                id: 'vid-1',
                                title: 'Setting up VS Code for JavaScript Development',
                                channel: 'Web Dev Simplified',
                                duration: '12:34'
                            },
                            {
                                id: 'vid-2',
                                title: 'HTML & CSS Crash Course for Beginners',
                                channel: 'Traversy Media',
                                duration: '18:45'
                            },
                            {
                                id: 'vid-3',
                                title: 'Browser DevTools Complete Guide',
                                channel: 'Fireship',
                                duration: '8:20'
                            }
                        ],
                        lessons: [
                            { id: 'prereq-l1', title: 'Installing VS Code', duration: '10 min', isLocked: false },
                            { id: 'prereq-l2', title: 'HTML Fundamentals', duration: '15 min', isLocked: true },
                            { id: 'prereq-l3', title: 'CSS Basics', duration: '15 min', isLocked: true },
                            { id: 'prereq-l4', title: 'Browser DevTools Overview', duration: '10 min', isLocked: true }
                        ]
                    },
                    {
                        id: 'history',
                        title: 'History: Brendan Eich, Netscape',
                        description: 'Explore the origins of JavaScript and how it became the most popular programming language for the web.',
                        learningPoints: [
                            'Learn about JavaScript\'s creation in 1995',
                            'Understand the role of Netscape',
                            'Discover how JavaScript evolved',
                            'See its impact on modern web development'
                        ],
                        estimatedTime: '30 mins',
                        videos: [
                            {
                                id: 'vid-hist-1',
                                title: 'The History of JavaScript in 10 Minutes',
                                channel: 'Fireship',
                                duration: '10:12'
                            }
                        ],
                        lessons: [
                            { id: 'history-l1', title: 'Birth of JavaScript', duration: '12 min', isLocked: false },
                            { id: 'history-l2', title: 'The Browser Wars', duration: '10 min', isLocked: true },
                            { id: 'history-l3', title: 'Modern JavaScript Era', duration: '8 min', isLocked: true }
                        ]
                    },
                    {
                        id: 'ecma',
                        title: 'ECMAScript: ES5 → ES6+',
                        description: 'Understand the standardization of JavaScript and the major improvements introduced in modern versions.',
                        learningPoints: [
                            'Learn what ECMAScript is',
                            'Understand ES5 vs ES6+ differences',
                            'Explore new syntax features',
                            'Know which features to use today'
                        ],
                        estimatedTime: '1 hour',
                        lessons: [
                            { id: 'ecma-l1', title: 'What is ECMAScript?', duration: '15 min', isLocked: false },
                            { id: 'ecma-l2', title: 'ES5 Features', duration: '20 min', isLocked: true },
                            { id: 'ecma-l3', title: 'ES6+ Modern Syntax', duration: '25 min', isLocked: true }
                        ]
                    }
                ]
            },
            {
                id: 'basics',
                title: 'Basics',
                chapters: [
                    {
                        id: 'keywords',
                        title: 'Keywords vs Identifiers',
                        description: 'Learn the fundamental building blocks of JavaScript code and how to name your variables properly.',
                        learningPoints: [
                            'Understand reserved keywords',
                            'Learn identifier naming rules',
                            'Follow naming conventions',
                            'Avoid common mistakes'
                        ],
                        estimatedTime: '30 mins',
                        lessons: [
                            { id: 'keywords-l1', title: 'Reserved Keywords', duration: '10 min', isLocked: false },
                            { id: 'keywords-l2', title: 'Identifier Rules', duration: '12 min', isLocked: true },
                            { id: 'keywords-l3', title: 'Naming Conventions', duration: '8 min', isLocked: true }
                        ]
                    },
                    {
                        id: 'variables',
                        title: 'Variables: var, let, const',
                        description: 'Master the three ways to declare variables in JavaScript and when to use each one.',
                        learningPoints: [
                            'Understand var, let, and const',
                            'Learn when to use each declaration',
                            'Avoid var pitfalls',
                            'Write modern JavaScript code'
                        ],
                        estimatedTime: '1 hour',
                        videos: [
                            {
                                id: 'vid-var-1',
                                title: 'JavaScript Variables Explained: var, let, const',
                                channel: 'Programming with Mosh',
                                duration: '15:22'
                            },
                            {
                                id: 'vid-var-2',
                                title: 'Understanding Variable Scope in JavaScript',
                                channel: 'The Net Ninja',
                                duration: '10:15'
                            }
                        ],
                        lessons: [
                            { id: 'variables-l1', title: 'Introduction to Variables', duration: '15 min', isLocked: false },
                            { id: 'variables-l2', title: 'Understanding var', duration: '18 min', isLocked: true },
                            { id: 'variables-l3', title: 'Modern let and const', duration: '20 min', isLocked: true },
                            { id: 'variables-l4', title: 'When to Use Each', duration: '12 min', isLocked: true }
                        ]
                    },
                    {
                        id: 'scope',
                        title: 'Scope: Global, Function, Block',
                        description: 'Understand how JavaScript determines variable accessibility and avoid scope-related bugs.',
                        learningPoints: [
                            'Learn about global scope',
                            'Understand function scope',
                            'Master block scope with let/const',
                            'Avoid scope pollution'
                        ],
                        estimatedTime: '1.5 hours',
                        lessons: [
                            { id: 'scope-l1', title: 'Global Scope', duration: '20 min', isLocked: false },
                            { id: 'scope-l2', title: 'Function Scope', duration: '25 min', isLocked: true },
                            { id: 'scope-l3', title: 'Block Scope', duration: '25 min', isLocked: true },
                            { id: 'scope-l4', title: 'Scope Chain', duration: '20 min', isLocked: true }
                        ]
                    },
                    {
                        id: 'hoisting',
                        title: 'Hoisting & Temporal Dead Zone',
                        description: 'Demystify JavaScript\'s hoisting behavior and understand the temporal dead zone.',
                        learningPoints: [
                            'Understand what hoisting is',
                            'Learn how var is hoisted',
                            'Understand temporal dead zone',
                            'Write predictable code'
                        ],
                        estimatedTime: '1 hour',
                        lessons: [
                            { id: 'hoisting-l1', title: 'What is Hoisting?', duration: '15 min', isLocked: false },
                            { id: 'hoisting-l2', title: 'var Hoisting Behavior', duration: '20 min', isLocked: true },
                            { id: 'hoisting-l3', title: 'Temporal Dead Zone', duration: '18 min', isLocked: true },
                            { id: 'hoisting-l4', title: 'Best Practices', duration: '12 min', isLocked: true }
                        ]
                    }
                ]
            },
            {
                id: 'datatypes',
                title: 'Data Types',
                chapters: [
                    { id: 'primitives', title: 'Primitives: String, Number, Boolean, etc.', description: 'Master JavaScript\'s primitive data types and how to work with them effectively.', learningPoints: ['Understand strings, numbers, booleans', 'Learn about null and undefined', 'Work with symbols and BigInt', 'Know when to use each type'], estimatedTime: '1 hour' },
                    { id: 'references', title: 'References: Objects, Arrays', description: 'Learn how reference types work differently from primitives in JavaScript.', learningPoints: ['Understand reference vs value', 'Work with objects and arrays', 'Avoid mutation bugs', 'Master copying techniques'], estimatedTime: '1.5 hours' },
                    { id: 'conversion', title: 'Type Conversion & Coercion', description: 'Understand how JavaScript converts between types automatically and manually.', learningPoints: ['Learn explicit conversion', 'Understand implicit coercion', 'Avoid coercion pitfalls', 'Write type-safe code'], estimatedTime: '1 hour' },
                    { id: 'truthy', title: 'Truthy & Falsy Values', description: 'Master JavaScript\'s truth evaluation and write cleaner conditional code.', learningPoints: ['Know all falsy values', 'Understand truthy evaluation', 'Use in conditionals', 'Avoid common mistakes'], estimatedTime: '45 mins' }
                ]
            },
            {
                id: 'operators',
                title: 'Operators',
                chapters: [
                    { id: 'arithmetic', title: 'Arithmetic: +, -, *, /, %, **', description: 'Learn all arithmetic operators and how to perform mathematical operations in JavaScript.', learningPoints: ['Master basic math operators', 'Understand modulo and exponentiation', 'Handle operator precedence', 'Avoid precision issues'], estimatedTime: '45 mins' },
                    { id: 'comparison', title: 'Comparison: ==, ===, !=, !==, >, <', description: 'Understand the difference between loose and strict equality in JavaScript.', learningPoints: ['Know == vs === differences', 'Use strict equality by default', 'Compare different types safely', 'Write bug-free comparisons'], estimatedTime: '1 hour' },
                    { id: 'logical', title: 'Logical: &&, ||, !', description: 'Master logical operators and short-circuit evaluation for powerful conditionals.', learningPoints: ['Understand AND, OR, NOT', 'Use short-circuit evaluation', 'Combine multiple conditions', 'Write clean boolean logic'], estimatedTime: '45 mins' },
                    { id: 'unary', title: 'Unary & Ternary Operators', description: 'Learn compact operators for common operations and conditional assignments.', learningPoints: ['Use increment/decrement', 'Master ternary operator', 'Understand typeof and delete', 'Write concise code'], estimatedTime: '30 mins' }
                ]
            },
            {
                id: 'control',
                title: 'Control Flow',
                chapters: [
                    { id: 'ifelse', title: 'if / else statements', description: 'Master conditional logic to make your programs make decisions.', learningPoints: ['Write if/else statements', 'Use else if for multiple conditions', 'Nest conditionals properly', 'Keep code readable'], estimatedTime: '1 hour' },
                    { id: 'switch', title: 'switch statements', description: 'Use switch statements for cleaner multi-way branching.', learningPoints: ['Understand switch syntax', 'Use break correctly', 'Know when to use switch vs if', 'Handle default cases'], estimatedTime: '45 mins' },
                    { id: 'early', title: 'Early return patterns', description: 'Write cleaner functions by returning early and avoiding deep nesting.', learningPoints: ['Reduce nesting depth', 'Improve code readability', 'Handle edge cases first', 'Write professional code'], estimatedTime: '30 mins' }
                ]
            },
            {
                id: 'loops',
                title: 'Loops',
                chapters: [
                    { id: 'for', title: 'for loop', description: 'Master the most common loop in JavaScript for iterating over sequences.', learningPoints: ['Write for loops correctly', 'Understand loop mechanics', 'Use for...of and for...in', 'Avoid infinite loops'], estimatedTime: '1 hour' },
                    { id: 'while', title: 'while / do-while', description: 'Use while loops when you don\'t know how many iterations you need.', learningPoints: ['Understand while loops', 'Know do-while differences', 'Choose the right loop type', 'Prevent infinite loops'], estimatedTime: '45 mins' },
                    { id: 'break', title: 'break & continue', description: 'Control loop flow with break and continue statements.', learningPoints: ['Exit loops early with break', 'Skip iterations with continue', 'Use labels for nested loops', 'Write efficient loops'], estimatedTime: '30 mins' }
                ]
            },
            {
                id: 'functions',
                title: 'Functions',
                chapters: [
                    { id: 'declarations', title: 'Function declarations', description: 'Learn how to create reusable blocks of code with functions.', learningPoints: ['Declare functions properly', 'Understand hoisting behavior', 'Return values from functions', 'Use function expressions'], estimatedTime: '1 hour' },
                    { id: 'arrow', title: 'Arrow functions', description: 'Master modern arrow function syntax and understand this binding.', learningPoints: ['Write arrow functions', 'Understand this context', 'Know when to use arrows', 'Write concise code'], estimatedTime: '1 hour' },
                    { id: 'params', title: 'Parameters vs arguments', description: 'Understand the difference between parameters and arguments in functions.', learningPoints: ['Define function parameters', 'Pass arguments correctly', 'Use default parameters', 'Handle variable arguments'], estimatedTime: '45 mins' },
                    { id: 'rest', title: 'Rest & spread operators', description: 'Master the ... operator for flexible function arguments and array/object manipulation.', learningPoints: ['Use rest parameters', 'Spread arrays and objects', 'Combine with destructuring', 'Write flexible functions'], estimatedTime: '1 hour' },
                    { id: 'closures', title: 'Closures', description: 'Understand one of JavaScript\'s most powerful features for data privacy and callbacks.', learningPoints: ['Understand closure concept', 'Create private variables', 'Use in callbacks', 'Avoid memory leaks'], estimatedTime: '1.5 hours' },
                    { id: 'iife', title: 'IIFE (Immediately Invoked Function Expression)', description: 'Learn the pattern for creating isolated scopes and avoiding global pollution.', learningPoints: ['Understand IIFE syntax', 'Create private scopes', 'Use in modules', 'Avoid global variables'], estimatedTime: '30 mins' },
                    { id: 'hof', title: 'Higher Order Functions', description: 'Master functions that take or return other functions for powerful abstractions.', learningPoints: ['Understand HOF concept', 'Use map, filter, reduce', 'Create custom HOFs', 'Write functional code'], estimatedTime: '1.5 hours' }
                ]
            },
            {
                id: 'arrays-objects',
                title: 'Arrays & Objects',
                chapters: [
                    { id: 'array-methods', title: 'Array methods: map, filter, reduce', description: 'Master the most powerful array methods for data transformation.', learningPoints: ['Transform arrays with map', 'Filter data efficiently', 'Reduce to single values', 'Chain methods together'], estimatedTime: '2 hours' },
                    { id: 'object-structure', title: 'Object structure & properties', description: 'Understand how objects work and how to manipulate their properties.', learningPoints: ['Create and modify objects', 'Add and delete properties', 'Understand property attributes', 'Work with nested objects'], estimatedTime: '1 hour' },
                    { id: 'notation', title: 'Dot vs bracket notation', description: 'Learn when to use dot notation vs bracket notation for object access.', learningPoints: ['Use dot notation', 'Use bracket notation', 'Access dynamic properties', 'Choose the right syntax'], estimatedTime: '30 mins' },
                    { id: 'destructuring', title: 'Destructuring assignment', description: 'Extract values from arrays and objects with modern destructuring syntax.', learningPoints: ['Destructure arrays', 'Destructure objects', 'Use default values', 'Write cleaner code'], estimatedTime: '1 hour' }
                ]
            }
        ]
    };
}
