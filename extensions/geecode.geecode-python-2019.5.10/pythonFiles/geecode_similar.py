#!/usr/bin/env python
# -*- coding: UTF-8 -*-

__author__ = 'geecode@outlook.com'
__version__ = '1.0'

import sys
import math
from io import StringIO
import token
import tokenize
import argparse
import json


class CosineDiff(object):
    @staticmethod
    def __token_frequency(source):
        """
        get valid token (name/number/string) and occur frequency.
        """
        io_obj = StringIO(u'' + source)
        tf = {}

        prev_toktype = token.INDENT
        last_lineno = -1
        last_col = 0

        tokgen = tokenize.generate_tokens(io_obj.readline)
        for toktype, ttext, (slineno, scol), (elineno, ecol), ltext in tokgen:
            if slineno > last_lineno:
                last_col = 0
            if scol > last_col:
                # out += (" " * (scol - last_col))
                pass
            if toktype == token.STRING and prev_toktype == token.INDENT:
                # Docstring
                # out += ("#--")
                pass
            elif toktype == tokenize.COMMENT:
                # Comment
                # out += ("##\n")
                pass
            elif toktype == tokenize.NAME or toktype == tokenize.NUMBER or toktype == tokenize.STRING:
                # out += (ttext)
                if ttext.strip():
                    key = str(toktype) + '.' + ttext  # add token type as prefix
                    if tf.get(key):
                        tf[key] = tf.get(key) + 1
                    else:
                        tf[key] = 1
            prev_toktype = toktype
            last_col = ecol
            last_lineno = elineno

        return tf

    @staticmethod
    def __quadratic_sum(number_list):
        result = 0
        for x in number_list:
            result += x * x
        return result

    @staticmethod
    def __get_cosine(a_frequency, b_frequency):
        up = 0.0
        # print(a_frequency)
        # print(b_frequency)
        for key in a_frequency.keys():
            if b_frequency.get(key):
                up += a_frequency[key] * b_frequency[key]
        a = CosineDiff.__quadratic_sum(a_frequency.values())
        b = CosineDiff.__quadratic_sum(b_frequency.values())
        return up / math.sqrt(a * b)

    @staticmethod
    def normalize(code_str_list):
        tf_list = []
        for index, code_str in enumerate(code_str_list):
            tf = CosineDiff.__token_frequency(code_str)
            tf_list.append((index, tf))
        return tf_list

    @staticmethod
    def similarity(a_code, b_code):
        """
        Simpler and faster implementation of difflib.unified_diff.
        """
        assert a_code is not None
        assert a_code is not None
        return CosineDiff.__get_cosine(a_code, b_code)


def detect(code_str_list, diff_method=CosineDiff):

    if len(code_str_list) < 2:
        return []

    code_list = diff_method.normalize(code_str_list)

    base_index, base_code = code_list[0]
    diff_result = []
    for candidate_index, candidate_code in code_list[1:]:
        diff_result.append((candidate_index, diff_method.similarity(base_code, candidate_code)))

    return diff_result


def find_similar(similarity_threshold, code_list, limit):
    if len(code_list) < 2:
        return []

    sim_result = detect(code_list)

    def sim_of_item(val):
        return val[1]

    sim_result.sort(key=sim_of_item, reverse=True)
    result = []
    for code in sim_result:
        if len(result) >= limit:
            break
        elif code[1] > similarity_threshold:
            result.append(code_list[code[0]])
        else:
            break
    return result


def run():
    """
    The console_scripts Entry Point in setup.py
   """

    def get_file(value):
        return open(value, 'r')

    parser = argparse.ArgumentParser(description='A simple example finder, read files from stdin as '
                                                 'json array or file list')
    parser.add_argument('-t', metavar='threshold', nargs='?', type=float, default=0.5,
                        help='similarity threshold, 0.5 by default')
    parser.add_argument('-n', metavar='limit', nargs='?', type=int, default=1, help='result size, 1 by default')
    parser.add_argument('-f', metavar='file', nargs='+', type=get_file, help='the base & examples source files')
    args = parser.parse_args()

    similarity_threshold = args.t
    limit = args.n
    if args.f:
        code_list = [f.read() for f in args.f]
    else:
        code_list = [item for item in json.load(sys.stdin)]

    examples = find_similar(similarity_threshold, code_list, limit)

    print(json.dumps(examples, separators=(',', ':')))


if __name__ == '__main__':
    run()
