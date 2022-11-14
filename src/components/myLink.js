export const MyLink = (props) => {

    const { link, children } = props
  
    return (
      <a href={link} className="btn btn-link text-decoration-none text-dark">
        {children}
      </a>
    )
  }