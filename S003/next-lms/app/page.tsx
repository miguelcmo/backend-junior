
export default function Home() {
  const database_url = process.env.DATABASE_URL
  const which_load = process.env.WHICH_LOAD

  return (
    <>
      <h1>LMS App starts here!</h1>
      <p>{database_url}</p>      
      <p>{which_load}</p>
    </>
  );
}
