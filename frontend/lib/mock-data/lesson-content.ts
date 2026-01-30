// Mock lesson content data
export interface ContentSection {
    type: 'heading' | 'paragraph' | 'list' | 'code';
    content: string | string[];
    language?: string; // for code blocks
}

export interface LessonContent {
    lessonId: string;
    sections: ContentSection[];
}

// Lesson content map
export const lessonContentMap: Record<string, LessonContent> = {
    // JavaScript Roadmap - Prerequisites
    'prereq-l1': {
        lessonId: 'prereq-l1',
        sections: [
            {
                type: 'paragraph',
                content: 'Visual Studio Code is a lightweight but powerful source code editor developed by Microsoft. It comes with built-in support for JavaScript, TypeScript, and Node.js, and has a rich ecosystem of extensions for other languages and tools.'
            },
            {
                type: 'heading',
                content: 'Why VS Code?'
            },
            {
                type: 'list',
                content: [
                    'Lightweight and fast - starts up quickly and runs smoothly',
                    'Built-in Git integration - manage your code versions easily',
                    'Extensive extension marketplace - customize your editor',
                    'IntelliSense code completion - write code faster',
                    'Integrated terminal - no need to switch windows'
                ]
            },
            {
                type: 'heading',
                content: 'Installation Steps'
            },
            {
                type: 'list',
                content: [
                    'Visit code.visualstudio.com',
                    'Download the installer for your operating system (Windows, macOS, or Linux)',
                    'Run the installer and follow the setup wizard',
                    'Launch VS Code and explore the welcome screen'
                ]
            },
            {
                type: 'heading',
                content: 'Verify Installation'
            },
            {
                type: 'paragraph',
                content: 'Open your terminal and run the following command to verify VS Code is installed correctly:'
            },
            {
                type: 'code',
                language: 'bash',
                content: 'code --version'
            }
        ]
    },
    'prereq-l2': {
        lessonId: 'prereq-l2',
        sections: [
            {
                type: 'paragraph',
                content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure and content of a web page using a system of tags and elements.'
            },
            {
                type: 'heading',
                content: 'Basic HTML Structure'
            },
            {
                type: 'code',
                language: 'html',
                content: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Hello World!</h1>\n    <p>This is a paragraph.</p>\n  </body>\n</html>'
            },
            {
                type: 'heading',
                content: 'Common HTML Elements'
            },
            {
                type: 'list',
                content: [
                    'Headings: <h1> to <h6> for different heading levels',
                    'Paragraphs: <p> for text content',
                    'Links: <a> for hyperlinks',
                    'Images: <img> for displaying images',
                    'Divs: <div> for grouping content'
                ]
            }
        ]
    },
    'prereq-l3': {
        lessonId: 'prereq-l3',
        sections: [
            {
                type: 'paragraph',
                content: 'CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, positioning, and overall visual presentation.'
            },
            {
                type: 'heading',
                content: 'CSS Syntax'
            },
            {
                type: 'code',
                language: 'css',
                content: 'selector {\n  property: value;\n  another-property: value;\n}'
            },
            {
                type: 'heading',
                content: 'Common CSS Properties'
            },
            {
                type: 'list',
                content: [
                    'color: sets text color',
                    'background-color: sets background color',
                    'font-size: controls text size',
                    'margin: adds space outside elements',
                    'padding: adds space inside elements'
                ]
            },
            {
                type: 'heading',
                content: 'Example'
            },
            {
                type: 'code',
                language: 'css',
                content: 'h1 {\n  color: blue;\n  font-size: 32px;\n  text-align: center;\n}'
            }
        ]
    },

    // JavaScript Roadmap - Variables
    'variables-l1': {
        lessonId: 'variables-l1',
        sections: [
            {
                type: 'paragraph',
                content: 'Variables are containers for storing data values. In JavaScript, we can declare variables using var, let, or const. Each has different characteristics and use cases.'
            },
            {
                type: 'heading',
                content: 'Variable Declaration'
            },
            {
                type: 'code',
                language: 'javascript',
                content: 'let name = "John";\nconst age = 30;\nvar city = "New York";'
            },
            {
                type: 'heading',
                content: 'Key Differences'
            },
            {
                type: 'list',
                content: [
                    'let: block-scoped, can be reassigned, modern approach',
                    'const: block-scoped, cannot be reassigned, use for constants',
                    'var: function-scoped, can be reassigned (avoid in modern code)'
                ]
            },
            {
                type: 'heading',
                content: 'Best Practice'
            },
            {
                type: 'paragraph',
                content: 'Use const by default. Only use let when you know the value will change. Avoid var in modern JavaScript.'
            }
        ]
    },
    'variables-l2': {
        lessonId: 'variables-l2',
        sections: [
            {
                type: 'paragraph',
                content: 'The var keyword was the original way to declare variables in JavaScript. While still valid, it has some quirks that can lead to bugs in modern applications.'
            },
            {
                type: 'heading',
                content: 'Function Scope'
            },
            {
                type: 'paragraph',
                content: 'Variables declared with var are function-scoped, not block-scoped. This means they are accessible throughout the entire function, even before declaration (due to hoisting).'
            },
            {
                type: 'code',
                language: 'javascript',
                content: 'function example() {\n  console.log(x); // undefined (not an error!)\n  var x = 10;\n  console.log(x); // 10\n}'
            },
            {
                type: 'heading',
                content: 'Problems with var'
            },
            {
                type: 'list',
                content: [
                    'No block scope - accessible outside if/for blocks',
                    'Hoisting can cause confusion',
                    'Can be redeclared without error',
                    'Global var creates window properties'
                ]
            }
        ]
    },

    // JavaScript Roadmap - Scope
    'scope-l1': {
        lessonId: 'scope-l1',
        sections: [
            {
                type: 'paragraph',
                content: 'Global scope refers to variables that are accessible from anywhere in your code. Variables declared outside any function or block have global scope.'
            },
            {
                type: 'heading',
                content: 'Creating Global Variables'
            },
            {
                type: 'code',
                language: 'javascript',
                content: 'const appName = "My App"; // global\nlet version = "1.0"; // global\n\nfunction showInfo() {\n  console.log(appName); // accessible\n  console.log(version); // accessible\n}'
            },
            {
                type: 'heading',
                content: 'Global Scope Risks'
            },
            {
                type: 'list',
                content: [
                    'Name collisions - variables can overwrite each other',
                    'Memory usage - global variables persist throughout app lifetime',
                    'Testing difficulty - harder to isolate and test code',
                    'Security concerns - exposed to all scripts'
                ]
            },
            {
                type: 'heading',
                content: 'Best Practice'
            },
            {
                type: 'paragraph',
                content: 'Minimize global variables. Use modules, functions, and block scope to keep variables local whenever possible.'
            }
        ]
    },

    // Generic Roadmap Lessons
    'ch-1-1-l1': {
        lessonId: 'ch-1-1-l1',
        sections: [
            {
                type: 'paragraph',
                content: 'Welcome to your learning journey! This lesson will help you get started with the fundamentals and set you up for success in the upcoming chapters.'
            },
            {
                type: 'heading',
                content: 'What You\'ll Learn'
            },
            {
                type: 'list',
                content: [
                    'Core concepts and terminology',
                    'Setting up your development environment',
                    'Understanding the learning path ahead',
                    'Best practices from day one'
                ]
            },
            {
                type: 'heading',
                content: 'Getting Started'
            },
            {
                type: 'paragraph',
                content: 'The key to mastering any skill is consistent practice and a solid understanding of fundamentals. Take your time with each concept and don\'t rush through the material.'
            }
        ]
    },
    'ch-1-2-l1': {
        lessonId: 'ch-1-2-l1',
        sections: [
            {
                type: 'paragraph',
                content: 'Understanding the basics is crucial for building a strong foundation. This lesson covers the essential concepts that everything else builds upon.'
            },
            {
                type: 'heading',
                content: 'Core Principles'
            },
            {
                type: 'list',
                content: [
                    'Start with simple examples',
                    'Build complexity gradually',
                    'Practice regularly',
                    'Learn from mistakes'
                ]
            },
            {
                type: 'heading',
                content: 'Key Takeaways'
            },
            {
                type: 'paragraph',
                content: 'Focus on understanding why things work the way they do, not just memorizing syntax. This deeper understanding will help you solve problems more effectively.'
            }
        ]
    },
    'ch-2-1-l1': {
        lessonId: 'ch-2-1-l1',
        sections: [
            {
                type: 'paragraph',
                content: 'Now that you understand the basics, it\'s time to apply those concepts to real-world scenarios. This lesson introduces practical techniques you\'ll use daily.'
            },
            {
                type: 'heading',
                content: 'Practical Applications'
            },
            {
                type: 'list',
                content: [
                    'Solving common problems',
                    'Optimizing your workflow',
                    'Building reusable solutions',
                    'Debugging effectively'
                ]
            },
            {
                type: 'heading',
                content: 'Next Steps'
            },
            {
                type: 'paragraph',
                content: 'Practice these techniques with small projects. The more you apply what you learn, the more natural it will become.'
            }
        ]
    }
};

// Helper function to get lesson content
export function getLessonContent(lessonId: string): LessonContent | null {
    return lessonContentMap[lessonId] || null;
}
