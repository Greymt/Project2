import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import TopicLearning from '../../components/learning/TopicLearning';

const LearningPage: React.FC = () => {
  const router = useRouter();
  const { topic } = router.query;

  if (!topic) {
    return <Layout title="Học Câu Hỏi">Đang tải...</Layout>;
  }

  return (
    <Layout title="Học Câu Hỏi">
      <TopicLearning topicId={topic as string} />
    </Layout>
  );
};

export default LearningPage;

