import styled from 'styled-components';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 0;
`;

const ImageSlide = styled.div`
  position: relative;
  margin-bottom: 10px;
  width: 100%;
  height: 280px;
  overflow: hidden;

  :hover {
    > div:nth-child(1) {
      > button {
        opacity: 1;
        transition: opacity 0.3s;
      }
    }
  }

  > div {
    :nth-child(1) {
      position: absolute;
      width: 100%;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      z-index: 1;

      > button {
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        opacity: 0;
        top: 0;

        &.left {
          left: 10px;
        }

        &.right {
          right: 10px;
        }

        > svg {
          font-size: 22px;
        }
      }
    }

    :nth-child(2) {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 0;
      border-radius: 10px;
      overflow: hidden;

      > div {
        transition: transform 0.5s;
        width: 100%;
        height: 100%;
        display: flex;

        > img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      }

    }
  }
`;

const SlideDots = styled.div`
  position: absolute;
  width: 100%;
  height: 40px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  text-align: center;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  > div {
    width: 30%;
    margin: 0 auto;
    transform: translateY(10px);
    overflow: hidden;

    > div {
      display: flex;
      transition: transform 0.3s;

      > span {
        display: inline-block;
        min-width: 8px;
        min-height: 8px;
        border-radius: 50%;
        background: var(--gray-color);
        opacity: 0.5;
        transform: scale(0.7);
        transition: transform 0.3s;

        &.active {
          background: var(--white-color);
          opacity: 1;
          transform: scale(1);
        }

        :not(:first-child) {
          margin-left: 5px;
        }
      }
    }
  }
`;

const Info = styled.div`
  padding: 0 10px 10px;
  box-sizing: border-box;
  font-size: 15px;

  > h2 {
    font-weight: bold;
    font-size: 17px;
    margin-bottom: 5px;
  }

  > p {
    margin-bottom: 10px;
  }
`;

interface CardType {
  item: AnimalList;
  loading: boolean;
}

const Card = ({ item, loading }: CardType) => {
  const {
    images, title, varieties, age, price, index,
  }: AnimalList = item;
  const [priceText, setPriceText] = useState('');
  const [ageText, setAgeText] = useState('');
  const [slide, setSlide] = useState(0);

  const nextSlide = () => {
    setSlide(slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide - 1);
  };

  useEffect(() => {
    setPriceText(`${price ? `${Intl.NumberFormat('ko-KR').format(price)}원` : '무료'}`);

    if (varieties && age) {
      setAgeText(`${varieties} / ${age}살`);
    }
  }, [age, price, varieties]);

  return (
    <Wrapper key={index}>
      <ImageSlide>
        <div>
          {slide > 0 && (
            <button type="button" onClick={prevSlide} className="left">
              <BsArrowLeftShort />
            </button>
          )}
          {slide < images.length - 1 && (
            <button type="button" onClick={nextSlide} className="right">
              <BsArrowRightShort />
            </button>
          )}
        </div>
        <div>
          {loading && (
            <Skeleton style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
            />
          )}
          <div style={{
            transform: `translateX(-${slide * 100}%)`,
          }}
          >
            {images.map((src, imagesIndex) => (
              <img src={src} alt="" key={imagesIndex} />
            ))}
          </div>
        </div>
        {!loading && (
          <SlideDots>
            <div>
              <div style={{
                transform: `translateX(-${(slide - 3) * 13}px)`,
              }}
              >
                {images.map((src, dotsIndex) => (
                  <span className={slide === dotsIndex ? 'active' : ''} key={dotsIndex} />
                ))}
              </div>
            </div>
          </SlideDots>
        )}
      </ImageSlide>
      <Info>
        <h2>{loading ? <Skeleton /> : title}</h2>
        <p>{loading ? <Skeleton /> : ageText}</p>
        <p>{loading ? <Skeleton /> : priceText}</p>
      </Info>
    </Wrapper>
  );
};

export default Card;
