#!/usr/bin/env python
# -*- coding: UTF-8 -*-

__author__ = 'geecode@outlook.com'
__version__ = '1.0'

import sys
import math
from io import StringIO
import token
import tokenize
import sqlite3
import argparse


def __extract_import_keywords(code_string):
    """
    get valid keyword and occur frequency.
    """

    io_obj = StringIO(u'' + code_string)

    module_keywords = []
    for tok in tokenize.generate_tokens(io_obj.readline):
        token_type = tok[0]
        token_string = tok[1]
        # start_line, start_col = tok[2]
        # end_line, end_col = tok[3]
        ltext = tok[4]

        if not ltext.startswith('import') and not ltext.startswith('from'):
            continue

        if token_type == tokenize.NAME or token_type == tokenize.NUMBER or token_type == tokenize.STRING:
            if token_string == 'import' or token_string == 'as' or token_string == 'from':
                pass
            else:
                module_keywords.append(token_string)

    return module_keywords


def __select_example(example_db_file, keywords):
    # load example from
    conn = sqlite3.connect(example_db_file)
    c = conn.cursor()

    sql = 'SELECT code FROM example WHERE (1=0)'
    for k in keywords:
        sql += " OR tags like '%" + k + "%'"
    # print(sql)
    c.execute(sql)
    example_code_list = c.fetchall()
    # print(example_code_list)
    conn.close()

    return example_code_list


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


# @_profile
def diff_files():
    """
    The console_scripts Entry Point in setup.py
    """
    def get_file(value):
        return open(value, 'r')

    parser = argparse.ArgumentParser(description='A simple plagiarism detection tool for python code')
    parser.add_argument('-t', nargs='?', type=float, default=0.5, help='the input file')
    parser.add_argument('file', type=get_file, nargs='+', help='the input files')
    args = parser.parse_args()
    pycode_list = [(f.name, f.read()) for f in args.file]

    print(args.t)
    exit()

    results = detect([c[1] for c in pycode_list])
    print(results)


def find_example(similarity_threshold, base_code_string, example_db_file):

    keywords = __extract_import_keywords(base_code_string)

    example_code_list = __select_example(example_db_file, keywords)

    if len(example_code_list) < 1:
        print(False)
        exit()

    # compare
    code_list = [base_code_string]
    for ex in example_code_list:
        code_list.append(ex[0])

    sim_result = detect(code_list)

    def of_sim(val):
        return val[1]

    sim_result.sort(key=of_sim, reverse=True)
    if sim_result[0][1] > similarity_threshold:
        print(True)
        print(code_list[sim_result[0][0]])
    else:
        print(False)
        print(sim_result[0][1])


def run():
    """
    The console_scripts Entry Point in setup.py
   """

    def get_file(value):
        return open(value, 'r')

    parser = argparse.ArgumentParser(description='A simple example finder')
    parser.add_argument('-t', nargs='?', type=float, default=0.5, help='similarity threshold')
    parser.add_argument('exam', help='example db file')
    parser.add_argument('-f', nargs='?', type=get_file, help='the target code source file')
    args = parser.parse_args()

    similarity_threshold = args.t
    example_db_file = args.exam
    if args.f:
        base_code_string = (args.f.read())
    else:
        base_code_string = sys.stdin.read()

    return find_example(similarity_threshold, base_code_string, example_db_file)


if __name__ == '__main__':
    run()
