import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Button from '@components/Button';
import TextField from '@components/TextField';
import useInput from '@hooks/useInput';
import { useMutation } from '@apollo/client';
import { CREATE_BOARD } from '@repository/mutation/board';
import useParseError from '@hooks/useParseError';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  width: 1200px;
  margin: 0 auto;
  margin-top: var(--md-space);
  border-radius: 10px;

  > div {
    :nth-of-type(1),
    :nth-of-type(2) {
      margin-bottom: var(--md-space);

      > span {
        position: relative;
        top: -5px;
      }
    }
  }
`;

const ButtonWrap = styled.div`
  max-width: 150px;
  margin: 0 auto;
  margin-top: var(--md-space);
`;

const ToastEditor = dynamic(() => import('@components/ToastEditor'), {
  ssr: false,
});

const Write = () => {
  const editorRef = useRef();
  const subject = useInput('');
  const [write, { error }] = useMutation(CREATE_BOARD);
  const router = useRouter();

  const createBoard = async () => {
    // ssr 문제 때문에 dynamic으로 import를 하면 ref를 사용 못하는 문제가 있는데 시간 없어서 일단 이렇게 해두고 나중에 수정 할 예정
    if (!document) return;
    const editor = Array.from(document.querySelectorAll('.ProseMirror')).pop();
    const somnail = editor?.querySelector('img')?.src || '';

    const response = await write({
      variables: {
        input: {
          subject: subject.value,
          content: editor?.innerHTML,
          somnail,
        },
      },
    });

    console.log('response', response);

    toast('작성되었습니다.');
    router.push('/');
    // router.push(`/view/${response.data.createBoard?.id}`);
  };

  useEffect(() => {
    if (error) {
      useParseError(error);
    }
  }, [error]);

  return (
    <Wrapper>
      <div>
        <TextField {...subject} placeholder="글제목" />
      </div>
      <ToastEditor
        ref={editorRef}
      />
      <ButtonWrap>
        <Button text="글작성" onClick={createBoard} />
      </ButtonWrap>
    </Wrapper>
  );
};

export default Write;
