#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from io import StringIO
import tokenize
import argparse
import json
import sys


def __collect_name(name_stack, names):
    if len(name_stack) > 0:
        keys = []
        # dump field keywords
        for field in name_stack:
            keys.append(field)
        # dump union keyword
        if len(name_stack) > 1:
            keys.append('.'.join(name_stack))
        for key in keys:
            if names.get(key):
                names[key] = names.get(key) + 1
            else:
                names[key] = 1
        # clear stack
        del name_stack[:]


def scan_keywords(code_string, keyword_set):
    """
    get valid keyword and occur frequency.
    """

    io_obj = StringIO(code_string)
    names = {}
    name_token_stack = []

    pre_token_type = tokenize.INDENT
    pre_token_str = None

    for tok in tokenize.generate_tokens(io_obj.readline):
        token_type = tok[0]
        token_str = tok[1]
        # start_line, start_col = tok[2]
        # end_line, end_col = tok[3]
        # line_text = tok[4]
        #
        # if 0:   # Change to if 1 to see the tokens fly by.
        #     print("%10s %-14s %-20r %r" % (
        #         tokenize.tok_name.get(token_type, token_type),
        #         "%d.%d-%d.%d" % (start_line, start_col, end_line, end_col),
        #         token_str, line_text
        #         ))

        if token_type == tokenize.OP and token_str == '.':
            pass
        elif token_type == tokenize.NAME:
            if pre_token_type == tokenize.OP and pre_token_str == '.':
                name_token_stack.append(token_str)
            else:
                __collect_name(name_token_stack, names)
                name_token_stack.append(token_str)
        else:
            __collect_name(name_token_stack, names)

        pre_token_type = token_type
        pre_token_str = token_str

    # add tail process
    __collect_name(name_token_stack, names)

    def bin_search(word, wordList):
        first = 0
        last = len(wordList) - 1
        found = False
        while first <= last and not found:
            middle = (first + last) // 2
            if wordList[middle] == word:
                found = True
            else:
                if word < wordList[middle]:
                    last = middle - 1
                else:
                    first = middle + 1
        return found

    kf = {}
    for key in names.keys():
        if bin_search(key, keyword_set):
            kf[key] = names[key]

    return kf


def main():
    """
    The console_scripts Entry Point in setup.py
    """

    def get_file(value):
        return open(value, 'r')

    parser = argparse.ArgumentParser(description='python keyword scan util')
    parser.add_argument('keywords', type=get_file, help='keywords dictionary')
    parser.add_argument('-f', nargs='?', type=get_file, help='the target code source file')
    args = parser.parse_args()

    keywords = args.keywords.read().splitlines()
    keywords.sort()

    if args.f:
        code_string = (args.f.read())
    else:
        code_string = sys.stdin.read()

    results = scan_keywords(code_string, keywords)
    print(json.dumps(results, sort_keys=True, separators=(',', ':')))
    # print('"', ' '.join(results.keys()), '"')
    # print(json.dumps(list(results.keys()), sort_keys=True, separators=(',', ':')))


if __name__ == '__main__':
    main()
