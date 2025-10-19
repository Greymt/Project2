import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import QuizPlayer from '../../components/quiz/QuizPlayer';

const QuizDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <Layout title="Bài Thi">Đang tải...</Layout>;
  }

  return (
    <Layout title="Làm Bài Thi">
      <QuizPlayer quizId={id as string} />
    </Layout>
  );
};

export default QuizDetailPage;

