interface Props{
    children: React.ReactNode
}

const Container:React.FC<Props> = ({children}) => {
    return (
            <main className="min-h-screen px-12">
                {children}
            </main>
    )
}
export default Container