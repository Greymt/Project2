require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

async function seed() {
    const uri = process.env.NEXT_PUBLIC_MONGODB_URI;

    if (!uri) {
        console.error('Please set MONGODB_URI environment variable');
        process.exit(1);
    }

    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
        await client.connect();
        const dbName = process.env.NEXT_PUBLIC_MONGODB_DB;
        const db = dbName ? client.db(dbName) : client.db();

        // Create 3 topics
        const topics = [
            { id: new ObjectId().toString(), name: 'Topic 1 - Basic', description: 'Basic knowledge', createdAt: new Date().toISOString() },
            { id: new ObjectId().toString(), name: 'Topic 2 - Intermediate', description: 'Intermediate level', createdAt: new Date().toISOString() },
            { id: new ObjectId().toString(), name: 'Topic 3 - Advanced', description: 'Advanced topics', createdAt: new Date().toISOString() },
        ];

        // Insert topics (upsert to avoid duplicates by name)
        const topicsColl = db.collection('topics');
        for (const t of topics) {
            await topicsColl.updateOne({ name: t.name }, { $setOnInsert: t }, { upsert: true });
        }

        // Re-fetch topics to get consistent ids (in case of existing docs)
        const insertedTopics = await topicsColl.find({ name: { $in: topics.map(t => t.name) } }).toArray();

        // For each topic, insert 10 questions and one quiz
        const questionsColl = db.collection('questions');
        const quizzesColl = db.collection('quizzes');

        for (const topic of insertedTopics) {
            const topicId = topic.id ?? topic._id?.toString();

            // Create questions based on topic
            const questions = [];
            if (topic.name === 'Topic 1 - Basic') {
                const englishQuestions = [
                    {
                        question: "Topic 1 - Question 1: What is the plural form of 'child'?",
                        optionA: "childs",
                        optionB: "children",
                        optionC: "childes",
                        optionD: "childrens",
                        correctAnswer: "B",
                        explanation: "The correct plural form of 'child' is 'children'."
                    },
                    {
                        question: "Topic 1 - Question 2: Which word is a noun?",
                        optionA: "quickly",
                        optionB: "run",
                        optionC: "beautiful",
                        optionD: "table",
                        correctAnswer: "D",
                        explanation: "'Table' is a noun; it refers to an object."
                    },
                    {
                        question: "Topic 1 - Question 3: Choose the correct sentence.",
                        optionA: "He go to school every day.",
                        optionB: "He goes to school every day.",
                        optionC: "He going to school every day.",
                        optionD: "He gone to school every day.",
                        correctAnswer: "B",
                        explanation: "The third person singular form requires 'goes'."
                    },
                    {
                        question: "Topic 1 - Question 4: Which of these is a verb?",
                        optionA: "happy",
                        optionB: "running",
                        optionC: "blue",
                        optionD: "slow",
                        correctAnswer: "B",
                        explanation: "'Running' is the verb form of 'run'."
                    },
                    {
                        question: "Topic 1 - Question 5: What is the opposite of 'hot'?",
                        optionA: "cold",
                        optionB: "warm",
                        optionC: "cool",
                        optionD: "boiling",
                        correctAnswer: "A",
                        explanation: "'Cold' is the direct opposite of 'hot'."
                    },
                    {
                        question: "Topic 1 - Question 6: What is the past tense of 'go'?",
                        optionA: "goed",
                        optionB: "gone",
                        optionC: "went",
                        optionD: "goes",
                        correctAnswer: "C",
                        explanation: "The correct past form of 'go' is 'went'."
                    },
                    {
                        question: "Topic 1 - Question 7: Choose the correct article: ___ apple a day keeps the doctor away.",
                        optionA: "A",
                        optionB: "An",
                        optionC: "The",
                        optionD: "No article",
                        correctAnswer: "B",
                        explanation: "Use 'an' before a vowel sound."
                    },
                    {
                        question: "Topic 1 - Question 8: Which is a question word?",
                        optionA: "Quickly",
                        optionB: "Beautiful",
                        optionC: "Who",
                        optionD: "Running",
                        correctAnswer: "C",
                        explanation: "'Who' is used to ask about a person."
                    },
                    {
                        question: "Topic 1 - Question 9: Choose the correct form: She ___ happy today.",
                        optionA: "am",
                        optionB: "is",
                        optionC: "are",
                        optionD: "be",
                        correctAnswer: "B",
                        explanation: "With 'she', use 'is'."
                    },
                    {
                        question: "Topic 1 - Question 10: What is the synonym of 'big'?",
                        optionA: "small",
                        optionB: "tiny",
                        optionC: "huge",
                        optionD: "little",
                        correctAnswer: "C",
                        explanation: "'Huge' means very big."
                    }
                ];

                // Add required fields to each question
                englishQuestions.forEach(q => {
                    questions.push({
                        ...q,
                        id: new ObjectId().toString(),
                        topicId,
                        createdAt: new Date().toISOString()
                    });
                });
            } else if (topic.name === 'Topic 2 - Intermediate') {
                const englishQuestions = [
                    {
                        question: "Topic 2 - Question 1: Choose the correct form: If I ___ time, I would travel more.",
                        optionA: "have",
                        optionB: "had",
                        optionC: "has",
                        optionD: "having",
                        correctAnswer: "B",
                        explanation: "Second conditional: 'If I had time...'."
                    },
                    {
                        question: "Topic 2 - Question 2: What is the passive voice of 'They built the house in 2010'?",
                        optionA: "The house was built in 2010.",
                        optionB: "The house built in 2010.",
                        optionC: "The house is built in 2010.",
                        optionD: "The house has built in 2010.",
                        correctAnswer: "A",
                        explanation: "Passive: object + was/were + past participle."
                    },
                    {
                        question: "Topic 2 - Question 3: Which sentence uses a comparative adjective correctly?",
                        optionA: "This book is more interesting than that one.",
                        optionB: "This book is most interesting than that one.",
                        optionC: "This book is interestinger than that one.",
                        optionD: "This book is interest than that one.",
                        correctAnswer: "A",
                        explanation: "Use 'more' + adjective for longer adjectives."
                    },
                    {
                        question: "Topic 2 - Question 4: What does the phrasal verb 'give up' mean?",
                        optionA: "start something new",
                        optionB: "stop doing something",
                        optionC: "hand something over",
                        optionD: "continue working",
                        correctAnswer: "B",
                        explanation: "'Give up' means to stop doing something."
                    },
                    {
                        question: "Topic 2 - Question 5: Which of the following is an example of an idiom?",
                        optionA: "He is as strong as an ox.",
                        optionB: "He runs quickly.",
                        optionC: "He is tall.",
                        optionD: "He eats breakfast.",
                        correctAnswer: "A",
                        explanation: "An idiom is an expression with figurative meaning."
                    },
                    {
                        question: "Topic 2 - Question 6: Choose the correct reported speech: She said, 'I am tired.'",
                        optionA: "She said she is tired.",
                        optionB: "She said she was tired.",
                        optionC: "She said she tired.",
                        optionD: "She said she were tired.",
                        correctAnswer: "B",
                        explanation: "Backshift tense when reporting past speech."
                    },
                    {
                        question: "Topic 2 - Question 7: Select the correct preposition: She is interested ___ music.",
                        optionA: "on",
                        optionB: "in",
                        optionC: "at",
                        optionD: "to",
                        correctAnswer: "B",
                        explanation: "Use 'interested in' for topics of interest."
                    },
                    {
                        question: "Topic 2 - Question 8: Which is a compound sentence?",
                        optionA: "She likes tea.",
                        optionB: "She likes tea and he likes coffee.",
                        optionC: "Because she was tired, she went home.",
                        optionD: "Although she was late, she joined the class.",
                        correctAnswer: "B",
                        explanation: "A compound sentence joins two independent clauses with a conjunction."
                    },
                    {
                        question: "Topic 2 - Question 9: What is the antonym of 'honest'?",
                        optionA: "truthful",
                        optionB: "sincere",
                        optionC: "dishonest",
                        optionD: "open",
                        correctAnswer: "C",
                        explanation: "'Dishonest' means not honest."
                    },
                    {
                        question: "Topic 2 - Question 10: Which tense is used in 'I have lived here for 5 years'?",
                        optionA: "Past Simple",
                        optionB: "Present Continuous",
                        optionC: "Present Perfect",
                        optionD: "Past Perfect",
                        correctAnswer: "C",
                        explanation: "Present perfect shows an action continuing up to now."
                    }
                ]

                // Add required fields to each question
                englishQuestions.forEach(q => {
                    questions.push({
                        ...q,
                        id: new ObjectId().toString(),
                        topicId,
                        createdAt: new Date().toISOString()
                    });
                });
            } else if (topic.name === 'Topic 3 - Advanced') {
                const englishQuestions = [
                    {
                        question: "Topic 3 - Question 1: Choose the correct sentence using the subjunctive mood.",
                        optionA: "If I was you, I would study harder.",
                        optionB: "If I were you, I would study harder.",
                        optionC: "If I am you, I study harder.",
                        optionD: "If I be you, I study harder.",
                        correctAnswer: "B",
                        explanation: "In hypothetical situations, use 'were' for all subjects."
                    },
                    {
                        question: "Topic 3 - Question 2: Identify the sentence with a dangling modifier.",
                        optionA: "Running to the bus, my bag fell off.",
                        optionB: "Running to the bus, I dropped my bag.",
                        optionC: "While I ran, I saw the bus leave.",
                        optionD: "I was running when the bus left.",
                        correctAnswer: "A",
                        explanation: "In (A), 'Running to the bus' incorrectly modifies 'my bag'."
                    },
                    {
                        question: "Topic 3 - Question 3: Which sentence uses parallel structure correctly?",
                        optionA: "She likes dancing, to sing, and reading.",
                        optionB: "She likes to dance, sing, and read.",
                        optionC: "She likes dance, sing, and reading.",
                        optionD: "She likes to dancing, to sing, and reading.",
                        correctAnswer: "B",
                        explanation: "All verbs share the same 'to' infinitive form for balance."
                    },
                    {
                        question: "Topic 3 - Question 4: What is the meaning of the idiom 'break the ice'?",
                        optionA: "To start a conversation in a friendly way",
                        optionB: "To destroy something",
                        optionC: "To feel cold",
                        optionD: "To make someone angry",
                        correctAnswer: "A",
                        explanation: "'Break the ice' means to ease tension in a new situation."
                    },
                    {
                        question: "Topic 3 - Question 5: Which is a complex sentence?",
                        optionA: "He studied hard, and he passed.",
                        optionB: "Although he studied hard, he failed.",
                        optionC: "He studied hard; he passed.",
                        optionD: "He studied hard and passed.",
                        correctAnswer: "B",
                        explanation: "Complex sentences use a dependent clause with a subordinating conjunction."
                    },
                    {
                        question: "Topic 3 - Question 6: Identify the correct use of a relative clause.",
                        optionA: "The man who lives next door is a doctor.",
                        optionB: "The man he lives next door is a doctor.",
                        optionC: "The man which lives next door is a doctor.",
                        optionD: "The man living next door he is a doctor.",
                        correctAnswer: "A",
                        explanation: "Use 'who' for people in defining relative clauses."
                    },
                    {
                        question: "Topic 3 - Question 7: Choose the correct sentence using inversion.",
                        optionA: "Never have I seen such a beautiful view.",
                        optionB: "I have never seen such a beautiful view.",
                        optionC: "Never I have seen such a beautiful view.",
                        optionD: "I never have seen such a beautiful view.",
                        correctAnswer: "A",
                        explanation: "Inversion follows negative adverbials: 'Never have I...'"
                    },
                    {
                        question: "Topic 3 - Question 8: What is the synonym of 'meticulous'?",
                        optionA: "careless",
                        optionB: "thorough",
                        optionC: "lazy",
                        optionD: "rough",
                        correctAnswer: "B",
                        explanation: "'Meticulous' means very careful and precise."
                    },
                    {
                        question: "Topic 3 - Question 9: Identify the sentence with correct punctuation.",
                        optionA: "However she was late, she joined the meeting.",
                        optionB: "However, she was late she joined the meeting.",
                        optionC: "However, she was late, she joined the meeting.",
                        optionD: "However, she was late; she joined the meeting.",
                        correctAnswer: "D",
                        explanation: "Two independent clauses joined correctly by a semicolon."
                    },
                    {
                        question: "Topic 3 - Question 10: Choose the sentence with correct subject-verb agreement.",
                        optionA: "The data is accurate.",
                        optionB: "The data are accurate.",
                        optionC: "The datas are accurate.",
                        optionD: "The datum are accurate.",
                        correctAnswer: "B",
                        explanation: "'Data' is plural; the singular form is 'datum'."
                    }
                ]

                // Add required fields to each question
                englishQuestions.forEach(q => {
                    questions.push({
                        ...q,
                        id: new ObjectId().toString(),
                        topicId,
                        createdAt: new Date().toISOString()
                    });
                });
            }

            // Insert questions for current topic
            const qResult = await questionsColl.insertMany(questions);
            console.log(`Inserted ${qResult.insertedCount} questions for topic '${topic.name}' (topicId=${topicId})`);

            // Create one quiz for this topic
            const quizDoc = {
                id: new ObjectId().toString(),
                title: `${topic.name} - 10-question Quiz`,
                description: `A 10 question quiz for ${topic.name}`,
                topicId,
                duration: 15, // minutes
                passingScore: 60,
                createdAt: new Date().toISOString(),
            };

            // Upsert quiz by title to avoid duplicates
            const quizUpsert = await quizzesColl.updateOne(
                { title: quizDoc.title },
                { $setOnInsert: quizDoc },
                { upsert: true }
            );

            if (quizUpsert.upsertedCount) {
                console.log(`Inserted quiz '${quizDoc.title}'`);
            } else {
                console.log(`Quiz '${quizDoc.title}' already exists`);
            }
        }

        // Summary counts
        const totalTopics = await topicsColl.countDocuments({});
        const totalQuestions = await questionsColl.countDocuments({});
        const totalQuizzes = await quizzesColl.countDocuments({});

        console.log('\nSeeding summary:');
        console.log(`Topics: ${totalTopics}`);
        console.log(`Questions: ${totalQuestions}`);
        console.log(`Quizzes: ${totalQuizzes}`);

        await client.close();
        console.log('Seeding complete');
    } catch (err) {
        console.error('Seeding error:', err);
        try { await client.close(); } catch (e) { }
        process.exit(1);
    }
}

if (require.main === module) {
    seed();
}
