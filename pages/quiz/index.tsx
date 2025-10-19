import React from 'react';
import Layout from '../../components/layout';
import QuizList from '../../components/quiz/QuizList';

const QuizPage: React.FC = () => {
  return (
    <Layout title="Danh Sách Bài Thi">
      <QuizList />
    </Layout>
  );
};

export default QuizPage;

