import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';
import QuizResultComponent from '../../../components/quiz/QuizResult';

const QuizResultPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <Layout title="Kết Quả">Đang tải...</Layout>;
  }

  return (
    <Layout title="Kết Quả Bài Thi">
      <QuizResultComponent resultId={id as string} />
    </Layout>
  );
};

export default QuizResultPage;

