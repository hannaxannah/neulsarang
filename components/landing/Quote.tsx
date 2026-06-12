export default function Quote() {
  return (
    <section className="quote-section">
      <div className="container">
        <blockquote className="scripture">
          <p style={{ fontFamily: 'var(--font-sans)' }}>
            &ldquo;내가 너희에게 새 계명을 주노니 서로 사랑하라<br />
            내가 너희를 사랑한 것같이 너희도 서로 사랑하라&rdquo;
          </p>
          <cite>요한복음 13:34</cite>
        </blockquote>
      </div>
    </section>
  )
}
