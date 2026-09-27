const STEPS = [
  { num: 1, title: 'Reach out', desc: "Call, text, or send the form below. Tell us what's going on." },
  { num: 2, title: 'Walk the property', desc: 'We come out, take a look, and give you a written estimate — free, no pressure.' },
  { num: 3, title: 'Get it scheduled', desc: 'You get a real date and a clear scope of work before anything starts.' },
  { num: 4, title: 'Walkthrough & clean finish', desc: 'We review the finished work with you and leave the site tidy.' },
]

export default function Process() {
  return (
    <section id="process" className="band">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">How it works</span>
          <h2>Four steps, start to finish.</h2>
        </div>
        <div className="process-list">
          {STEPS.map((step) => (
            <div className="process-step" key={step.num}>
              <span className="num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
