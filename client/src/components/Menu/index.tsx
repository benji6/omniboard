import { Link } from '@reach/router'
import { Menu as EriMenu, ThemeToggle, ButtonGroup, Button } from 'eri'
import * as React from 'react'
import SignOutDialog from './SignOutDialog'
import { useAppState } from '../AppStateContainer'

interface IProps {
  open: boolean
  handleMenuClose(): void
}

export default function Menu({ handleMenuClose, open }: IProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [
    {
      user: { email: userEmail },
    },
  ] = useAppState()

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    handleMenuClose()
  }

  return (
    <>
      <EriMenu onClose={handleMenuClose} open={open}>
        {userEmail && (
          <>
            <p>
              Signed in as:
              <br />
              {userEmail}
            </p>
            <ButtonGroup>
              <Button
                danger
                onClick={() => setIsDialogOpen(true)}
                variant="secondary"
              >
                Sign out
              </Button>
            </ButtonGroup>
            <hr />
          </>
        )}
        <ThemeToggle />
        <ul>
          <li>
            <Link onClick={handleMenuClose} to="/">
              Home
            </Link>
          </li>
          {userEmail ? (
            <li>
              <Link onClick={handleMenuClose} to="posts/create">
                Create post
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link onClick={handleMenuClose} to="sign-in">
                  Sign in
                </Link>
              </li>
              <li>
                <Link onClick={handleMenuClose} to="sign-up">
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </EriMenu>
      <SignOutDialog onClose={handleDialogClose} open={isDialogOpen} />
    </>
  )
}
