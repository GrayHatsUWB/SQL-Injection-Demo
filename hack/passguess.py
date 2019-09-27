#!/usr/bin/python3
from termcolor import colored, cprint
from time import sleep
from collections import namedtuple

class Guesses:
    total = 0
    successful = 0
    log = open('cracked.txt', 'w')

def guess_account(username, answer=None):
    Guesses.total += 1
    print(f"Guessing {username}... ", end="", flush=True)

    redirect = '/'
    if username == 'dave':
        redirect = '/sql'

    if answer != None:
        Guesses.successful += 1
        sleep(0.02)
        print(colored("OK", 'green') + ": '" + answer + "' → /")
        print(f"{username} {redirect} {answer}", file=Guesses.log)
    else:
        sleep(0.04)
        print(colored("FAIL", 'red') + " → /login")

def main():
    from sys import argv
    if len(argv) != 4:
        print(f"Usage: {argv[0]} [url] [userfield] [passfield]")
        return

    url = argv[1]
    userfield = argv[2]
    passfield = argv[3]

    print(f"Guessing accounts on {url}\n")
    sleep(1)

    # Users we're gonna pretend to crack
    weak_users = ['dave', 'marvin']

    users = []
    with open('users.txt') as fusers:
        for user in fusers:
            users.append(user.strip())

    passwds = []
    with open('passwds.txt') as fpasswds:
        for passwd in fpasswds:
            passwds.append(passwd.strip())

    for (user, passwd) in zip(users, passwds):
        if user in weak_users:
            guess_account(user, passwd)
        else:
            guess_account(user)

    # print statistics
    print(f"\n{Guesses.total} guessed; {Guesses.successful} passed")
    print("All cracked accounts recorded in cracked.txt")
    Guesses.log.close()

if __name__ == '__main__':
    main()
