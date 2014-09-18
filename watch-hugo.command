#!/bin/bash
cd "`dirname "${0}"`"
hugo --source=site --watch server
