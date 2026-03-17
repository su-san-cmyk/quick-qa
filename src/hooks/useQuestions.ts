import { useState, useEffect } from 'react';
import type { Question } from '../types';

const STORAGE_KEY = 'quick-qa-learning-data-v4'; // 20問への拡大に伴いキーを更新

const initialData: Question[] = [
    {
        id: '1',
        title: '問１',
        body: '仏教を説かれた釈尊について問う。(1)',
        subQuestions: [
            { id: '1-1', label: '(1)何国の人か', fields: [{ id: '1-1-1', label: '', correctAnswer: '印度の人' }] },
            {
                id: '1-2', label: '(2)父母の名', fields: [
                    { id: '1-2-1', label: '父', correctAnswer: '浄飯王' },
                    { id: '1-2-2', label: '母', correctAnswer: 'マーヤー夫人' }
                ]
            },
            { id: '1-3', label: '(3)成仏前の名', fields: [{ id: '1-3-1', label: '', correctAnswer: '悉達多太子' }] },
            { id: '1-4', label: '(4)出生の城の名', fields: [{ id: '1-4-1', label: '', correctAnswer: 'カピラ城' }] },
            { id: '1-5', label: '(5)生まれた月日', fields: [{ id: '1-5-1', label: '', correctAnswer: '四月八日' }] },
            { id: '1-6', label: '(6)誕生せられた地名', fields: [{ id: '1-6-1', label: '', correctAnswer: 'ルンビニー園' }] },
        ]
    },
    {
        id: '2',
        title: '問２',
        body: '仏教を説かれた釈尊について問う。(2)',
        subQuestions: [
            { id: '2-1', label: '(1)出城の年', fields: [{ id: '2-1-1', label: '', correctAnswer: '二十九才二月八日' }] },
            { id: '2-2', label: '(2)結婚の年', fields: [{ id: '2-2-1', label: '', correctAnswer: '十九才' }] },
            { id: '2-3', label: '(3)妻の名', fields: [{ id: '2-3-1', label: '', correctAnswer: 'ヤショダラ姫' }] },
            {
                id: '2-4', label: '(4)文武の師の名', fields: [
                    { id: '2-4-1', label: '文', correctAnswer: 'バッダラニー' },
                    { id: '2-4-2', label: '武', correctAnswer: 'センダイダイバー' }
                ]
            },
            { id: '2-5', label: '(5)成仏の年月日', fields: [{ id: '2-5-1', label: '', correctAnswer: '三十五才十二月八日' }] },
            { id: '2-6', label: '(6)亡くなられた年', fields: [{ id: '2-6-1', label: '', correctAnswer: '八十才二月十五日' }] },
            { id: '2-7', label: '(7)いつごろの人か', fields: [{ id: '2-7-1', label: '', correctAnswer: '約二千六百年前' }] },
        ]
    },
    {
        id: '3',
        title: '問３',
        body: 'さとりといっても仏教では五十二あるが、それを示せ。',
        subQuestions: [
            {
                id: '3-1', label: '', fields: [
                    { id: '3-1-1', label: '(1)', correctAnswer: '十信' },
                    { id: '3-1-2', label: '(2)', correctAnswer: '十住' },
                    { id: '3-1-3', label: '(3)', correctAnswer: '十行' },
                    { id: '3-1-4', label: '(4)', correctAnswer: '十回向' },
                    { id: '3-1-5', label: '(5)', correctAnswer: '十地' },
                    { id: '3-1-6', label: '(6)', correctAnswer: '等覚' },
                    { id: '3-1-7', label: '(7)', correctAnswer: '妙覚' },
                ]
            },
        ]
    },
    {
        id: '4',
        title: '問４',
        body: '仏覚をえた人を如来とも言うが、どんな意味か。',
        subQuestions: [
            { id: '4-1', label: '', fields: [{ id: '4-1-1', label: '答', correctAnswer: '真如より来現した人という意味。' }] },
        ]
    },
    {
        id: '5',
        title: '問５',
        body: '弥勒菩薩とか地蔵菩薩とか、多く菩薩と言われているものがあるが、菩薩とはどんなことか。',
        subQuestions: [
            { id: '5-1', label: '', fields: [{ id: '5-1-1', label: '答', correctAnswer: '菩提薩埵ということで、真実の仏教を求める人を言う。' }] },
        ]
    },
    {
        id: '6',
        title: '問６',
        body: '釈尊が三十五才で仏覚を悟られてから、八十才で入滅されるまでの、四十五年間、説かれたことの一切を記したものを、今日、一切経と言われるが、また、何と言われているかを書け。',
        subQuestions: [
            {
                id: '6-1', label: '', fields: [
                    { id: '6-1-1', label: '答1', correctAnswer: '八万の法蔵' },
                    { id: '6-1-2', label: '答2', correctAnswer: '一代教' }
                ]
            },
        ]
    },
    {
        id: '7',
        title: '問７',
        body: '大乗仏教と小乗仏教とはどう言うことか。どこが違うか。',
        subQuestions: [
            { id: '7-1', label: '小乗仏教', fields: [{ id: '7-1-1', label: '', correctAnswer: '小乗仏教：ききあやまって伝えられた仏教。我利我利の教え' }] },
            { id: '7-2', label: '大乗仏教', fields: [{ id: '7-2-1', label: '', correctAnswer: '大乗仏教：正しく伝えられた仏教。自利利他の教え' }] },
        ]
    },
    {
        id: '8',
        title: '問８',
        body: '浄土真宗の祖師、親鸞聖人について問う。',
        subQuestions: [
            { id: '8-1', label: '(1)出家された年', fields: [{ id: '8-1-1', label: '', correctAnswer: '九才' }] },
            { id: '8-2', label: '(2)信心決定せられた年', fields: [{ id: '8-2-1', label: '', correctAnswer: '二十九才' }] },
            { id: '8-3', label: '(3)結婚せられた年', fields: [{ id: '8-3-1', label: '', correctAnswer: '三十一才' }] },
            { id: '8-4', label: '(4)三大諍論せられた年', fields: [{ id: '8-4-1', label: '', correctAnswer: '三十四才' }] },
            { id: '8-5', label: '(5)流刑にあわれた年', fields: [{ id: '8-5-1', label: '', correctAnswer: '三十五才' }] },
            { id: '8-6', label: '(6)善鸞に義絶された年', fields: [{ id: '8-6-1', label: '', correctAnswer: '八十四才' }] },
            { id: '8-7', label: '(7)亡くなられた年', fields: [{ id: '8-7-1', label: '', correctAnswer: '九十才' }] },
        ]
    },
    {
        id: '9',
        title: '問９',
        body: '親鸞聖人の主なお聖教（ご著書）五つ以上記せ。',
        subQuestions: [
            {
                id: '9-1', label: '', fields: [
                    { id: '9-1-1', label: '1', correctAnswer: '教行信証' },
                    { id: '9-1-2', label: '2', correctAnswer: '愚禿鈔' },
                    { id: '9-1-3', label: '3', correctAnswer: '三帖和讃' },
                    { id: '9-1-4', label: '4', correctAnswer: '末灯鈔' },
                    { id: '9-1-5', label: '5', correctAnswer: '一念多念証文' },
                ]
            },
        ]
    },
    {
        id: '10',
        title: '問１０',
        body: '親鸞聖人の教えを正確に、多くの人たちに伝えられた、覚如上人のお聖教三つと、蓮如上人のお聖教二つをあげよ。',
        subQuestions: [
            {
                id: '10-1', label: '覚如上人', fields: [
                    { id: '10-1-1', label: '1', correctAnswer: '執持鈔' },
                    { id: '10-1-2', label: '2', correctAnswer: '改邪鈔' },
                    { id: '10-1-3', label: '3', correctAnswer: '口伝鈔' },
                ]
            },
            {
                id: '10-2', label: '蓮如上人', fields: [
                    { id: '10-2-1', label: '1', correctAnswer: '御文章' },
                    { id: '10-2-2', label: '2', correctAnswer: '正信偈大意' },
                ]
            },
        ]
    },
    {
        id: '11',
        title: '問１１',
        body: '親鸞聖人が最も尊敬された七人の高僧の名と、それぞれの国名と主著を示せ。',
        subQuestions: [
            {
                id: '11-1', label: '第一祖', fields: [
                    { id: '11-1-1', label: '名', correctAnswer: '龍樹菩薩' },
                    { id: '11-1-2', label: '主著', correctAnswer: '十住毘婆沙論' },
                    { id: '11-1-3', label: '国名', correctAnswer: '印度' }
                ]
            },
            {
                id: '11-2', label: '第二祖', fields: [
                    { id: '11-2-1', label: '名', correctAnswer: '天親菩薩' },
                    { id: '11-2-2', label: '主著', correctAnswer: '浄土論' },
                    { id: '11-2-3', label: '国名', correctAnswer: '印度' }
                ]
            },
            {
                id: '11-3', label: '第三祖', fields: [
                    { id: '11-3-1', label: '名', correctAnswer: '曇鸞大使' },
                    { id: '11-3-2', label: '主著', correctAnswer: '浄土論詿' },
                    { id: '11-3-3', label: '国名', correctAnswer: '中国' }
                ]
            },
            {
                id: '11-4', label: '第四祖', fields: [
                    { id: '11-4-1', label: '名', correctAnswer: '道綽禅師' },
                    { id: '11-4-2', label: '主著', correctAnswer: '安楽集' },
                    { id: '11-4-3', label: '国名', correctAnswer: '中国' }
                ]
            },
            {
                id: '11-5', label: '第五祖', fields: [
                    { id: '11-5-1', label: '名', correctAnswer: '善導大使' },
                    { id: '11-5-2', label: '主著', correctAnswer: '観無量寿経疏' },
                    { id: '11-5-3', label: '国名', correctAnswer: '中国' }
                ]
            },
            {
                id: '11-6', label: '第六祖', fields: [
                    { id: '11-6-1', label: '名', correctAnswer: '源信僧都' },
                    { id: '11-6-2', label: '主著', correctAnswer: '往生要集' },
                    { id: '11-6-3', label: '国名', correctAnswer: '日本' }
                ]
            },
            {
                id: '11-7', label: '第七祖', fields: [
                    { id: '11-7-1', label: '名', correctAnswer: '法然上人' },
                    { id: '11-7-2', label: '主著', correctAnswer: '選択本願念仏集' },
                    { id: '11-7-3', label: '国名', correctAnswer: '日本' }
                ]
            },
        ]
    },
    {
        id: '12',
        title: '問１２',
        body: '親鸞聖人の仰せは釈尊の直説である根拠をお聖教の御文を示せ。',
        subQuestions: [{ id: '12-1', label: '', fields: [{ id: '12-1-1', label: '答', correctAnswer: '更に親鸞珍しき法をも弘めず、如来の教法をわれも信じ人にも教え聞かしむるばかりなり。（御文章）' }] }]
    },
    {
        id: '13',
        title: '問１３',
        body: '仏教の目的を漢字四字で示せ。',
        subQuestions: [{ id: '13-1', label: '', fields: [{ id: '13-1-1', label: '答', correctAnswer: '抜苦与楽' }] }]
    },
    {
        id: '14',
        title: '問１４',
        body: '人生の苦しみを、四つに大別したものを四苦と言い、それに四つ加えたものを八苦という。その四苦八苦を示せ。',
        subQuestions: [
            {
                id: '14-1', label: '四苦', fields: [
                    { id: '14-1-1', label: '1', correctAnswer: '生苦' },
                    { id: '14-1-2', label: '2', correctAnswer: '老苦' },
                    { id: '14-1-3', label: '3', correctAnswer: '病苦' },
                    { id: '14-1-4', label: '4', correctAnswer: '死苦' }
                ]
            },
            {
                id: '14-2', label: '八苦', fields: [
                    { id: '14-2-1', label: '1', correctAnswer: '愛別離苦' },
                    { id: '14-2-2', label: '2', correctAnswer: '怨僧会苦' },
                    { id: '14-2-3', label: '3', correctAnswer: '求不得苦' },
                    { id: '14-2-4', label: '4', correctAnswer: '五陰盛苦' }
                ]
            }
        ]
    },
    {
        id: '15',
        title: '問１５',
        body: '万物はどのようにしてできていると、仏教で教えられているか。その経文と根拠を示せ。',
        subQuestions: [{ id: '15-1', label: '', fields: [{ id: '15-1-1', label: '答', correctAnswer: '一切法（万物）は因縁生なり。（大乗入楞伽経）' }] }]
    },
    {
        id: '16',
        title: '問１６',
        body: '仏教を説き明かした苦しみの原因と結果、幸福になる原因と結果の四つの真理を四聖諦と言う。その四聖諦を示せ。',
        subQuestions: [{
            id: '16-1', label: '', fields: [
                { id: '16-1-1', label: '苦諦', correctAnswer: '果　迷界' },
                { id: '16-1-2', label: '集諦', correctAnswer: '因　迷界' },
                { id: '16-1-3', label: '滅諦', correctAnswer: '果　悟界' },
                { id: '16-1-4', label: '道諦', correctAnswer: '因　悟界' }
            ]
        }]
    },
    {
        id: '17',
        title: '問１７',
        body: '仏教の根幹である因果の道理を書け。',
        subQuestions: [{
            id: '16-1', label: '', fields: [
                { id: '17-1-1', label: '1', correctAnswer: '善因善果' },
                { id: '17-1-2', label: '2', correctAnswer: '悪因悪化' },
                { id: '17-1-3', label: '3', correctAnswer: '自因自果' }
            ]
        }]
    },
    {
        id: '18',
        title: '問１８',
        body: '三業とは何か。',
        subQuestions: [{
            id: '18-1', label: '', fields: [
                { id: '18-1-1', label: '1', correctAnswer: '身業' },
                { id: '18-1-2', label: '2', correctAnswer: '口業' },
                { id: '18-1-3', label: '3', correctAnswer: '意業' }
            ]
        }]
    },
    {
        id: '19',
        title: '問１９',
        body: '我々の心を八つに分けて教えたものを、八識と言う。その八識を記せ。',
        subQuestions: [{
            id: '19-1', label: '', fields: [
                { id: '19-1-1', label: '1', correctAnswer: '眼識' },
                { id: '19-1-2', label: '2', correctAnswer: '耳識' },
                { id: '19-1-3', label: '3', correctAnswer: '鼻識' },
                { id: '19-1-4', label: '4', correctAnswer: '舌識' },
                { id: '19-1-5', label: '5', correctAnswer: '身識' },
                { id: '19-1-6', label: '6', correctAnswer: '意識' },
                { id: '19-1-7', label: '7', correctAnswer: '末那識' },
                { id: '19-1-8', label: '8', correctAnswer: '阿頼耶識' }
            ]
        }]
    },
    {
        id: '20',
        title: '問２０',
        body: '仏教は後生を否定する「断見外道」でも、後生変わらぬ魂が存在するという「常見外道」でもないことを説かれた経文と、その根拠を示せ。',
        subQuestions: [{ id: '20-1', label: '', fields: [{ id: '20-1-1', label: '答', correctAnswer: '因果応報なるが故に来世なきに非ず、無我なるが故に常有に非ず。（阿含経）' }] }]
    }
];

export const useQuestions = () => {
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setQuestions(JSON.parse(saved));
            } catch (e) {
                setQuestions(initialData);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
            }
        } else {
            setQuestions(initialData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
    }, []);

    const saveQuestions = (newQuestions: Question[]) => {
        setQuestions(newQuestions);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newQuestions));
    };

    const addQuestion = (question: Question) => {
        const newQuestions = [...questions, question];
        saveQuestions(newQuestions);
    };

    const updateQuestion = (updatedQuestion: Question) => {
        const newQuestions = questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q);
        saveQuestions(newQuestions);
    };

    const deleteQuestion = (id: string) => {
        const newQuestions = questions.filter(q => q.id !== id);
        saveQuestions(newQuestions);
    };

    return { questions, addQuestion, updateQuestion, deleteQuestion };
};
