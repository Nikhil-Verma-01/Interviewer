import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import Image from 'next/image'
import Link from 'next/link'

const page = async() => {
  const user = await getCurrentUser();

  //! By the Promise : allows you to fetch them in parallel as these request don't depend one another
  //**Previously in below code they getting fetch one after another, which imapct performance of our website

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatestInterviews({userId: user?.id!})
  ])
   
  // const userInterviews = await getInterviewByUserId(user?.id!);
  // const latestInterviews = await getLatestInterviews({userId: user?.id!});

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0
  
  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview-Ready with AI-Powered Pratice & Feedback</h2>
          <p className='text-lg'>
            Practice on real interview question & get instant feedback
          </p>

          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image src="/robot.png" alt='robo-dude'
        width={400} height={400} className='max-sm:hidden'/>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>

        <div className='interviews-section'>
          {hasPastInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id}/>

            ))) : (
              <p>There are no new interviews available</p>

          )}
            
        </div>
      </section>
          


      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>

        <div className='interviews-section'>
        {hasUpcomingInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id}/>

            ))) : (
              <p>You have&pos; t taken any interviews yet</p>

          )}
        </div>
      </section>
    </>
  )
}

export default page